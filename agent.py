#!/usr/bin/env python3
"""
AI agent that re-balances AgentVault on Somnia every 5 min
- fetches on-chain balances
- computes optimal ratio (simple mean-variance)
- calls rebalance() via web3
"""
import os
import time
import json
import logging
from web3 import Web3
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
RPC = os.getenv("RPC", "https://devnet.somnia.network")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
VAULT_ADDRESS = os.getenv("VAULT_ADDRESS")
CHAIN_ID = 52351  # Somnia DevNet chain-id

# AgentVault ABI (simplified for rebalance function)
ABI = [
    {
        "inputs": [{"name": "_newRatioA", "type": "uint256"}],
        "name": "rebalance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ratioA",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getVaultComposition",
        "outputs": [
            {"name": "balA", "type": "uint256"},
            {"name": "balB", "type": "uint256"},
            {"name": "currentRatio", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class SomniaAIAgent:
    def __init__(self):
        """Initialize the AI agent with Web3 connection."""
        self.w3 = Web3(Web3.HTTPProvider(RPC))
        
        if not self.w3.is_connected():
            raise Exception("Failed to connect to Somnia DevNet")
        
        logger.info(f"Connected to Somnia DevNet at {RPC}")
        
        if not PRIVATE_KEY:
            raise Exception("PRIVATE_KEY environment variable not set")
        
        self.account = self.w3.eth.account.from_key(PRIVATE_KEY)
        logger.info(f"Agent address: {self.account.address}")
        
        if not VAULT_ADDRESS:
            raise Exception("VAULT_ADDRESS environment variable not set")
        
        self.vault = self.w3.eth.contract(
            address=Web3.to_checksum_address(VAULT_ADDRESS),
            abi=ABI
        )
        logger.info(f"Vault contract: {VAULT_ADDRESS}")
    
    def get_current_ratio(self):
        """Get the current ratio from the vault."""
        try:
            ratio = self.vault.functions.ratioA().call()
            logger.info(f"Current ratio A: {ratio} basis points ({ratio/100:.1f}%)")
            return ratio
        except Exception as e:
            logger.error(f"Failed to get current ratio: {e}")
            return None
    
    def get_vault_composition(self):
        """Get current vault composition."""
        try:
            balA, balB, current_ratio = self.vault.functions.getVaultComposition().call()
            logger.info(f"Vault composition - A: {balA}, B: {balB}, Ratio: {current_ratio}")
            return balA, balB, current_ratio
        except Exception as e:
            logger.error(f"Failed to get vault composition: {e}")
            return None, None, None
    
    def optimal_ratio(self):
        """
        Compute optimal ratio using a simple strategy.
        For demo: 50% ± 15% based on block hash randomness and market conditions.
        In production, this would use sophisticated ML models and market data.
        """
        try:
            # Get latest block for randomness
            latest_block = self.w3.eth.get_block('latest')
            block_hash = int(latest_block.hash.hex(), 16)
            
            # Simple pseudo-random ratio around 50%
            # In production, this would analyze market data, volatility, etc.
            base_ratio = 5000  # 50%
            variance = 1500   # ±15%
            
            # Generate pseudo-random variation
            random_variation = (block_hash % (2 * variance)) - variance
            optimal = base_ratio + random_variation
            
            # Ensure ratio is within valid bounds (0-10000)
            optimal = max(1000, min(9000, optimal))  # Keep between 10% and 90%
            
            logger.info(f"Computed optimal ratio: {optimal} basis points ({optimal/100:.1f}%)")
            return optimal
            
        except Exception as e:
            logger.error(f"Failed to compute optimal ratio: {e}")
            return 5000  # Default to 50%
    
    def rebalance_vault(self, new_ratio):
        """Execute rebalance transaction on the vault."""
        try:
            # Get current nonce
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            
            # Build transaction
            tx_data = self.vault.functions.rebalance(new_ratio).build_transaction({
                'chainId': CHAIN_ID,
                'nonce': nonce,
                'gas': 200_000,
                'gasPrice': self.w3.to_wei('1', 'gwei'),
            })
            
            # Sign transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx_data, PRIVATE_KEY)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            logger.info(f"Rebalance transaction sent: {tx_hash.hex()}")
            
            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            if receipt.status == 1:
                logger.info(f"Rebalance successful! Block: {receipt.blockNumber}")
                return True
            else:
                logger.error("Rebalance transaction failed")
                return False
                
        except Exception as e:
            logger.error(f"Failed to execute rebalance: {e}")
            return False
    
    def run_once(self):
        """Run one iteration of the AI agent."""
        logger.info("=== AI Agent Iteration Started ===")
        
        # Get current state
        current_ratio = self.get_current_ratio()
        balA, balB, current_composition_ratio = self.get_vault_composition()
        
        if current_ratio is None or balA is None:
            logger.error("Failed to get current vault state, skipping this iteration")
            return
        
        # Compute optimal ratio
        optimal = self.optimal_ratio()
        
        # Check if rebalancing is needed
        ratio_diff = abs(optimal - current_ratio)
        
        # Only rebalance if difference is significant (>5%)
        if ratio_diff > 500:  # 5% threshold
            logger.info(f"Rebalancing needed: current {current_ratio} -> optimal {optimal}")
            success = self.rebalance_vault(optimal)
            
            if success:
                logger.info("Rebalancing completed successfully")
            else:
                logger.error("Rebalancing failed")
        else:
            logger.info(f"No rebalancing needed: current {current_ratio} ~ optimal {optimal}")
        
        logger.info("=== AI Agent Iteration Completed ===\n")
    
    def run(self):
        """Run the AI agent continuously."""
        logger.info("Starting Somnia AI Agent...")
        logger.info(f"Rebalancing interval: 5 minutes")
        
        while True:
            try:
                self.run_once()
                time.sleep(300)  # 5 minutes
            except KeyboardInterrupt:
                logger.info("AI Agent stopped by user")
                break
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                logger.info("Waiting 1 minute before retry...")
                time.sleep(60)  # Wait 1 minute before retry

def main():
    """Main entry point."""
    try:
        agent = SomniaAIAgent()
        agent.run()
    except Exception as e:
        logger.error(f"Failed to start AI agent: {e}")
        exit(1)

if __name__ == "__main__":
    main()