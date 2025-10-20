// src/lib/registry.ts
// MOCK IMPLEMENTATION FOR PROOF-OF-CONCEPT
// In a real application, this module would interact with a deployed smart contract.
// For this PoC, we use a simple in-memory Map to simulate the blockchain registry.

const peerIdRegistry = new Map<string, string>();

export class StreamRegistry {
  constructor() {
    console.log("Initialized MOCKED StreamRegistry for PoC.");
  }

  async registerStream(peerId: string): Promise<void> {
    // In a real app, the signer's address would be the key.
    // We'll simulate this with a hardcoded address for the streamer.
    const streamerAddress = "0xSTREAMER_ADDRESS"; // Mocked address

    console.log(`MOCK: Registering Peer ID ${peerId} for streamer ${streamerAddress}...`);
    peerIdRegistry.set(streamerAddress, peerId);

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("MOCK: Peer ID registered successfully.");
  }

  async getStreamerPeerId(streamerAddress: string): Promise<string | undefined> {
    console.log(`MOCK: Looking up Peer ID for streamer: ${streamerAddress}...`);
    const peerId = peerIdRegistry.get(streamerAddress);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (peerId) {
      console.log(`MOCK: Found Peer ID: ${peerId}`);
      return peerId;
    } else {
      console.log(`MOCK: No Peer ID found for ${streamerAddress}.`);
      return undefined;
    }
  }
}
