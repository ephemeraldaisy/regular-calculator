import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import random
import string
import json

app = FastAPI()

class DualNodeManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        # Generate a unique 6-digit session token on startup
        self.session_token = ''.join(random.choices(string.digits, k=6))
        print(f"[*] Server Initialized. Pairing Token: {self.session_token}")

    async def connect(self, websocket: WebSocket, token: str):
        # Strict Multi-user Prevention & Access Control
        if len(self.active_connections) >= 2:
            print("[!] Connection rejected: Maximum capacity (2) reached.")
            await websocket.close(code=1008) # Policy Violation
            return False
            
        if len(self.active_connections) == 1 and token != self.session_token:
            print("[!] Connection rejected: Invalid pairing token.")
            await websocket.close(code=1008)
            return False

        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[*] Client connected. Total active: {len(self.active_connections)}")
        return True

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"[*] Client disconnected. Total active: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                print(f"[!] Broadcast error: {e}")

manager = DualNodeManager()

@app.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    is_connected = await manager.connect(websocket, token)
    if not is_connected:
        return

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            await manager.broadcast(payload)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    # Deploys on port 2048 as specified
    uvicorn.run(app, host="0.0.0.0", port=2048)
