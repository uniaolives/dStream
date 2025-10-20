import asyncio
import json
import numpy as np
import sounddevice as sd
import websockets
from obswebsocket import obsws, requests as obsreq

# --- Configuration ---
OBS_HOST = "localhost"
OBS_PORT = 4455
WS_HOST = "localhost"
WS_PORT = 8081  # Port the frontend connects to
FFT_BINS = 128

# --- Global State ---
# This set will hold all active WebSocket connections
CONNECTED_CLIENTS = set()

def audio_callback(indata, frames, time, status):
    """
    This function is called by the sounddevice stream in a separate thread.
    It calculates the FFT and schedules the broadcast coroutine on the main event loop.
    """
    if status:
        print(f"Audio stream status: {status}")
        return

    # Calculate FFT from the audio input
    fft = np.abs(np.fft.rfft(indata.mean(axis=1), n=2048)[:FFT_BINS])
    packet = json.dumps(fft.astype(float).tolist())

    # Schedule the broadcast coroutine to run on the main asyncio event loop
    asyncio.run_coroutine_threadsafe(broadcast_packet(packet), asyncio.get_running_loop())

async def broadcast_packet(packet):
    """
    Sends a packet to all connected clients.
    Removes clients if their connection is closed.
    """
    if not CONNECTED_CLIENTS:
        return

    clients_to_remove = set()
    for client in CONNECTED_CLIENTS:
        try:
            await client.send(packet)
        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected, removing.")
            clients_to_remove.add(client)

    if clients_to_remove:
        CONNECTED_CLIENTS.difference_update(clients_to_remove)


async def connection_handler(websocket, path):
    """
    Handles a new WebSocket connection. Adds the client to our set and waits
    for them to disconnect.
    """
    print(f"New client connected from {path}")
    CONNECTED_CLIENTS.add(websocket)
    try:
        # Wait until the connection is closed
        await websocket.wait_closed()
    finally:
        print("Client disconnected.")
        CONNECTED_CLIENTS.remove(websocket)

async def main():
    """
    Main function to set up services and run forever.
    """
    ws = obsws(OBS_HOST, OBS_PORT, password="")
    try:
        ws.connect()
        print(f"Connected to OBS ws://{OBS_HOST}:{OBS_PORT}")
    except Exception as e:
        print(f"Failed to connect to OBS: {e}")
        return

    websocket_server = await websockets.serve(connection_handler, WS_HOST, WS_PORT)
    print(f"WebSocket server listening on ws://{WS_HOST}:{WS_PORT}")

    try:
        with sd.InputStream(
            device="Stream Mix (Wave Link)",
            callback=audio_callback,
            channels=2,
            samplerate=48000,
            blocksize=1024
        ):
            print("Capturing audio from 'Stream Mix (Wave Link)'")
            await asyncio.Event().wait()
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        websocket_server.close()
        await websocket_server.wait_closed()
        ws.disconnect()
        print("Services have been shut down.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nShutting down manually.")
