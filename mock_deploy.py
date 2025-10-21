#!/usr/bin/env python3
"""
Mock deployment script for demonstration purposes
This simulates deploying the AgentVault contract
"""
import os
import json
import time
from web3 import Web3

def mock_deploy():
    """Simulate contract deployment."""
    print("🚀 Mock Deployment of AgentVault Contract")
    print("=" * 50)
    
    # Generate a mock contract address
    mock_address = "0x" + "".join(["0"] * 38) + "42"  # Mock address ending in 42
    print(f"📍 Mock Contract Address: {mock_address}")
    
    # Mock deployment details
    deployment_info = {
        "contractName": "AgentVault",
        "address": mock_address,
        "network": "Somnia DevNet",
        "chainId": 52351,
        "transactionHash": "0x" + "0" * 64,  # Mock tx hash
        "gasUsed": 1500000,
        "blockNumber": 12345678,
        "timestamp": int(time.time()),
        "constructorArgs": {
            "tokenA": "0xEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeE",
            "tokenB": "0xDA100000000000000000000000000000000000000000000000000000000000000",
            "initialRatio": 5000
        }
    }
    
    # Save deployment info
    with open("deployment.json", "w") as f:
        json.dump(deployment_info, f, indent=2)
    
    print(f"💾 Deployment info saved to deployment.json")
    
    # Create .env file for the agent
    env_content = f"""# Somnia DevNet Configuration
RPC=https://devnet.somnia.network
PRIVATE_KEY=your_private_key_here
VAULT_ADDRESS={mock_address}

# Optional: Gas configuration
GAS_PRICE=1000000000  # 1 gwei
GAS_LIMIT=200000
"""
    
    with open("agent/.env", "w") as f:
        f.write(env_content)
    
    print(f"📝 Agent configuration saved to agent/.env")
    
    print("\n✅ Mock deployment completed!")
    print("\nNext steps:")
    print("1. Replace the PRIVATE_KEY in agent/.env with your actual private key")
    print("2. Fund your agent address with test tokens")
    print("3. Run the AI agent: cd agent && python agent.py")
    print("4. Or run with Docker: docker-compose up -d")
    
    return mock_address

if __name__ == "__main__":
    mock_deploy()