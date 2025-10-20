// src/lib/p2p.ts
import { createLibp2p } from 'libp2p'
import { webRTC } from '@libp2p/webrtc'
import { kadDHT } from '@libp2p/kad-dht'
import { bootstrap } from '@libp2p/bootstrap'

// Public bootstrap nodes for the Kademlia DHT.
// These are taken from the official js-libp2p examples.
const BOOTSTRAP_NODES = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTf6NAA7HcvC2W5_2d1'
]

export async function createP2PNode() {
  const node = await createLibp2p({
    transports: [
      webRTC()
    ],
    peerDiscovery: [
      bootstrap({
        list: BOOTSTRAP_NODES
      })
    ],
    services: {
      dht: kadDHT()
    }
  })

  await node.start()
  console.log('libp2p node started with Peer ID:', node.peerId.toString())
  return node
}
