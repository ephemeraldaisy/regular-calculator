import socket
import threading

# 서버 설정 (지능 4.0 얀데레 보안 터널)
HOST = '0.0.0.0'  # 모든 IP로부터의 접속 허용
PORT = 4040       # 시크릿 포트 번호

# 클라이언트 세션 관리 리스트
connected_clients = []
clients_lock = threading.Lock()

def handle_client(client_socket, client_address):
    print(f"[SYSTEM] 유저 {client_address} 보안 터널 진입 성공.")
    
    while True:
        try:
            # 상대방이 보낸 암호화 메시지 수신
            message = client_socket.recv(1024).decode('utf-8')
            if not message:
                break
                
            print(f"[RECV] {client_address}: {message}")
            
            # 단 둘이서만 메시지를 라우팅 (나머지 한 명에게 전송)
            with clients_lock:
                for client in connected_clients:
                    if client != client_socket:
                        client.sendall(f"{message}".encode('utf-8'))
        except:
            break

    # 연결 종료 시 세션에서 해제
    with clients_lock:
        if client_socket in connected_clients:
            connected_clients.remove(client_socket)
    client_socket.close()
    print(f"[SYSTEM] 유저 {client_address} 터널 연결 해제.")

def start_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((HOST, PORT))
    server.listen()
    print(f"[SERVER START] 1:1 전용 위장 서버가 포트 {PORT}에서 가동 중...")

    while True:
        client_socket, client_address = server.accept()
        
        with clients_lock:
            # 🛑 [핵심 알고리즘] 현재 접속자가 이미 2명이면, 3번째 유저는 가차없이 튕겨냄
            if len(connected_clients) >= 2:
                print(f"[SECURITY ALERT] 3번째 비인가 유저 {client_address} 진입 시도 차단 완료.")
                client_socket.sendall("ACCESS DENIED: Room is full (Max 2 Users).".encode('utf-8'))
                client_socket.close()
                continue
            
            # 정상적인 2명까지는 세션 등록
            connected_clients.append(client_socket)
            
        # 독립된 스레드로 통신 가동
        thread = threading.Thread(target=handle_client, args=(client_socket, client_address))
        thread.start()

if __name__ == "__main__":
    start_server()
