#!/bin/bash

# Somnia AI-Agent DeFi Vault Deployment Script
# This script deploys the AgentVault contract to Somnia DevNet

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Somnia AI-Agent DeFi Vault Deployment${NC}"
echo "=================================="

# Check if required environment variables are set
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}❌ PRIVATE_KEY environment variable is not set${NC}"
    echo "Please export your private key:"
    echo "export PRIVATE_KEY=your_private_key_here"
    exit 1
fi

# Configuration
RPC_URL=${RPC_URL:-"https://devnet.somnia.network"}
CHAIN_ID=52351
CONTRACT="AgentVault"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "RPC URL: $RPC_URL"
echo "Chain ID: $CHAIN_ID"
echo "Contract: $CONTRACT"
echo ""

# Navigate to contracts directory
cd contracts

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo -e "${RED}❌ Foundry is not installed${NC}"
    echo "Please install Foundry first:"
    echo "curl -L https://foundry.paradigm.xyz | bash"
    echo "foundryup"
    exit 1
fi

echo -e "${GREEN}🔨 Building contract...${NC}"
forge build

echo -e "${GREEN}📄 Deploying contract...${NC}"

# Mock token addresses for Somnia DevNet
TOKEN_A="0xEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeEeeeeE"  # ETH placeholder
TOKEN_B="0xDA100000000000000000000000000000000000000000000000000000000000000"  # Mock DAI
INITIAL_RATIO=5000  # 50%

# Deploy contract
DEPLOY_OUTPUT=$(forge create \
    --rpc-url "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    src/AgentVault.sol:AgentVault \
    --constructor-args "$TOKEN_A" "$TOKEN_B" "$INITIAL_RATIO" \
    --legacy \
    --json)

# Extract contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | jq -r '.deployedTo')

if [ -z "$CONTRACT_ADDRESS" ] || [ "$CONTRACT_ADDRESS" = "null" ]; then
    echo -e "${RED}❌ Failed to deploy contract${NC}"
    echo "Output: $DEPLOY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Contract deployed successfully!${NC}"
echo -e "${GREEN}📍 Contract Address: $CONTRACT_ADDRESS${NC}"

# Save contract address to file
echo "$CONTRACT_ADDRESS" > ../.vault_address
echo -e "${GREEN}💾 Contract address saved to .vault_address${NC}"

# Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
sleep 2

# Check if contract exists
CODE=$(cast code "$CONTRACT_ADDRESS" --rpc-url "$RPC_URL")
if [ "$CODE" = "0x" ]; then
    echo -e "${RED}❌ Contract deployment verification failed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Contract deployment verified!${NC}"
fi

# Get initial state
echo -e "${YELLOW}📊 Initial contract state:${NC}"
RATIO=$(cast call "$CONTRACT_ADDRESS" "ratioA()(uint256)" --rpc-url "$RPC_URL")
echo "Initial Ratio A: $RATIO basis points ($(($RATIO / 100))%)"

# Display next steps
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your .env file with the contract address:"
echo "   echo VAULT_ADDRESS=$CONTRACT_ADDRESS >> agent/.env"
echo ""
echo "2. Fund your agent address with test tokens"
echo "3. Run the AI agent:"
echo "   cd agent && python agent.py"
echo ""
echo "4. Or run with Docker:"
echo "   docker-compose up -d"
echo ""
echo -e "${YELLOW}🔗 Explorer: https://devnet.somnia.network/address/$CONTRACT_ADDRESS${NC}"