// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import type { Libp2p } from 'libp2p'
import { createP2PNode } from '../lib/p2p'
import { StreamRegistry } from '../lib/registry'

// Mock address for the streamer, matching the one in the mocked registry.
const MOCKED_STREAMER_ADDRESS = "0xSTREAMER_ADDRESS";

export default function Home() {
  const [node, setNode] = useState<Libp2p | null>(null)
  const [peerId, setPeerId] = useState<string>('')
  const [streamerAddress, setStreamerAddress] = useState<string>(MOCKED_STREAMER_ADDRESS)
  const [status, setStatus] = useState<string>('Not connected.')

  const registry = new StreamRegistry()

  useEffect(() => {
    const initNode = async () => {
      const p2pNode = await createP2PNode()
      setNode(p2pNode)
      setPeerId(p2pNode.peerId.toString())
    }
    initNode()
  }, [])

  const handleRegister = async () => {
    if (!peerId) {
      setStatus('P2P node is not ready.')
      return
    }
    try {
      setStatus('Registering Peer ID with the mocked registry...')
      await registry.registerStream(peerId)
      setStatus('Peer ID registered successfully in mock registry!')
    } catch (error) {
      console.error('Registration failed:', error)
      setStatus('Registration failed. See console for details.')
    }
  }

  const handleConnect = async () => {
    if (!node) {
      setStatus('P2P node is not ready.')
      return
    }
    if (!streamerAddress) {
      setStatus('Please enter a streamer address.')
      return
    }

    try {
      setStatus(`Looking up Peer ID for ${streamerAddress}...`)
      const targetPeerId = await registry.getStreamerPeerId(streamerAddress)

      if (!targetPeerId) {
        setStatus('Could not find Peer ID for this address in the mock registry.')
        return
      }

      setStatus(`Found Peer ID: ${targetPeerId}. Searching for peer on the DHT...`)

      const stream = await node.dial(targetPeerId)

      setStatus(`Successfully connected to streamer!`)
      console.log('Dial successful, stream:', stream)

    } catch (error) {
      console.error('Connection failed:', error)
      setStatus('Connection failed. Peer may be offline or unreachable. See console.')
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>dStream - Decentralized Signaling (PoC)</h1>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Your Peer ID:</strong> {peerId || 'Initializing...'}</p>

      <hr style={{ margin: '2rem 0' }} />

      <div>
        <h2>Streamer</h2>
        <p>Register your Peer ID on the (mocked) blockchain to become discoverable.</p>
        <button onClick={handleRegister} disabled={!peerId}>
          Register as Streamer
        </button>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <div>
        <h2>Viewer</h2>
        <p>Enter a streamer's Ethereum address to connect to their stream.</p>
        <input
          type="text"
          value={streamerAddress}
          onChange={(e) => setStreamerAddress(e.target.value)}
          placeholder="Enter streamer's Ethereum address"
          style={{ width: '400px', marginRight: '1rem' }}
        />
        <button onClick={handleConnect} disabled={!node || !streamerAddress}>
          Connect to Streamer
        </button>
      </div>
    </main>
  )
}
