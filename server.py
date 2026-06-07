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
    # 클라이언트(앱)가 계산기에서 비밀번호로 친 토큰을 기반으로 접속 승인
    is_connected = await manager.connect(websocket, token)
    if not is_connected:
        return

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # [편집 포인트] 채팅 메세지('chat')뿐만 아니라 
            # 비대면 육아 캐릭터의 경험치를 올리는 시스템 신호 등도 
            # 터지지 않고 두 사람에게 실시간 브로드캐스트되도록 안전하게 전달합니다.
            await manager.broadcast(payload)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
