# Twitch Wavelink Bridge

This project creates a real-time audio visualizer for Twitch streams using OBS and Elgato Wave Link. It listens to the "Stream Mix" channel in OBS and feeds the audio data to a Three.js shader, which can be used as a browser source in OBS.

## 1. Installation

```bash
# 1-a) OBS-WebSocket client + audio analyser
pip install obs-websocket-py numpy sounddevice websockets
```

## 2. One-time OBS setup (30 s)

1.  Tools → WebSocket Server Settings →
    ✅ Enable WebSocket server
    Server Port: `4455` (default)
    Password: **leave empty** (local only)
2.  In Wave Link app → **Stream Mix** → set as **OBS source** (already done if you followed Elgato’s guide).

## 3. Start the bridge

```bash
python bridge.py
```

You’ll see:
```
Connected to OBS ws://localhost:4455
WebSocket server listening on ws://localhost:8081
Capturing audio from 'Stream Mix (Wave Link)'
```

## 4. Start the Web Server and Add to OBS

In a second terminal, run:
```bash
python -m http.server 8080
```

Then, drop the visualiser into OBS as a **Browser Source**:

-   URL: `http://localhost:8080/public/`
-   Width/Height: `1920×1080`

The page automatically connects to the WebSocket stream and renders the shader.
