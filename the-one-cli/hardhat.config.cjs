
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    somnia: {
      url: "https://rpc.somnia.network",
      accounts: process.env.PRIVATE_KEY ? [`0x\${process.env.PRIVATE_KEY}`] : [],
    },
  },
};
