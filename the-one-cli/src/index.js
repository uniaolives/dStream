#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';
import tar from 'tar';
import hre from 'hardhat';
import surge from 'surge';
import { Octokit } from "@octokit/rest";
import { execSync } from 'child_process';
import os from 'os';

const workflowFile = `
name: Deploy Everywhere
on:
  push:
    branches: [main]
jobs:
  everywhere:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: foundry-rs/foundry-toolchain@v1
      - run: npm install -g the-one-cli
      - run: the-one deploy --chain somnia --token-a \${{ vars.TOKEN_A }} --token-b \${{ vars.TOKEN_B }} --initial-ratio 5000
        env:
          PRIVATE_KEY: \${{ secrets.PRIVATE_KEY }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;

yargs(hideBin(process.argv))
  .command('init', 'Scaffold .github/workflows/everywhere.yml', () => {}, (argv) => {
    const dir = '.github/workflows';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, 'everywhere.yml');
    fs.writeFileSync(filePath, workflowFile);
    console.log(`✅ Created \${filePath}`);

    if (!fs.existsSync('contracts')) {
        fs.mkdirSync('contracts');
        fs.writeFileSync('contracts/AgentVault.sol', `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentVault {
    address public tokenA;
    address public tokenB;
    uint256 public initialRatio;

    constructor(address _tokenA, address _tokenB, uint256 _initialRatio) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        initialRatio = _initialRatio;
    }
}
`);
    }

    if (!fs.existsSync('overlay')) {
        fs.mkdirSync('overlay');
        fs.writeFileSync('overlay/index.html', '<h1>dStream Overlay</h1>');
    }

    if (!fs.existsSync('agent')) {
        fs.mkdirSync('agent');
        fs.writeFileSync('agent/requirements.txt', 'web3==6.11.3\npython-dotenv==1.0.0\nrequests==2.31.0');
    }
  })
  .command('deploy', 'Deploy the AgentVault', (yargs) => {
    return yargs
      .option('chain', {
        describe: 'The chain to deploy to',
        demandOption: true,
        type: 'string'
      })
      .option('token-a', {
        describe: 'The first token address',
        demandOption: true,
        type: 'string'
      })
      .option('token-b', {
        describe: 'The second token address',
        demandOption: true,
        type: 'string'
      })
      .option('initial-ratio', {
        describe: 'The initial ratio of the tokens',
        demandOption: true,
        type: 'number'
      })
      .option('rpc-url', {
        describe: 'The RPC URL of the chain to deploy to',
        type: 'string'
      })
  }, async (argv) => {
    console.log('Deploying with the following arguments:');
    console.log(`  Chain: \${argv.chain}`);
    console.log(`  Token A: \${argv.tokenA}`);
    console.log(`  Token B: \${argv.tokenB}`);
    console.log(`  Initial Ratio: \${argv.initialRatio}`);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'the-one-'));
    const srcDir = path.join(tmpDir, 'src');
    fs.mkdirSync(srcDir);
    fs.copyFileSync('contracts/AgentVault.sol', path.join(srcDir, 'AgentVault.sol'));
    fs.cpSync('agent', path.join(tmpDir, 'agent'), { recursive: true });
    fs.cpSync('overlay', path.join(tmpDir, 'overlay'), { recursive: true });

    hre.config.paths.sources = srcDir;

    await tar.c(
      {
        gzip: true,
        file: 'AgentVault.tar.gz',
        cwd: tmpDir
      },
      ['src', 'agent', 'overlay']
    )
    console.log('✅ Packaged AgentVault.tar.gz');

    hre.config.networks[argv.chain] = {
        url: argv.rpcUrl || `https://rpc.\${argv.chain}.network`,
        accounts: [`0x\${process.env.PRIVATE_KEY}`]
    };

    await hre.run('compile', { quiet: true });

    const AgentVault = await hre.ethers.getContractFactory("AgentVault");
    const agentVault = await AgentVault.deploy(argv.tokenA, argv.tokenB, argv.initialRatio);

    await agentVault.waitForDeployment();

    fs.rmSync(tmpDir, { recursive: true, force: true });


    console.log(`✅ AgentVault \${agentVault.address} (\${argv.chain})`);

    const results = await surge({
      project: './overlay',
      domain: 'dstream-overlay.surge.sh'
    });

    console.log(`✅ Overlay \${results.domain}`);

    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY) {
        const octokit = new Octokit({
          auth: process.env.GITHUB_TOKEN
        });

        const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
        const tag = `v\${Date.now()}-everywhere`;

        const release = await octokit.repos.createRelease({
          owner,
          repo,
          tag_name: tag,
          name: tag,
          body: `AgentVault: \`\${agentVault.address}\`\nOverlay: \`\${results.domain}\``
        });

        const { data: { upload_url } } = release;

        await octokit.repos.uploadReleaseAsset({
            owner,
            repo,
            release_id: release.data.id,
            name: 'AgentVault.tar.gz',
            data: fs.readFileSync('AgentVault.tar.gz')
        });

        console.log(`✅ Release \${release.data.html_url}`);
    } else {
        console.log('Skipping GitHub release because GITHUB_TOKEN and GITHUB_REPOSITORY are not set.');
    }
  })
  .demandCommand(1)
  .parse();
