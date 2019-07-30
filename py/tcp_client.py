import socket
import argparse

def client():
    host = SERVER
    port = PORT

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((host, port))

    try:
        message = input('==> ')
        while True:
            s.send(message.encode('utf-8'))
            data = s.recv(1024).decode('utf-8')
            print('peer: ' + data)
            message = input('==> ')
    except KeyboardInterrupt:
        s.close()
        exit(0)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--server', help='Address of server to connect to', default=socket.gethostname())
    parser.add_argument('-p', '--port', type=int, help='Port on local machine to use', default=8080)
    args = parser.parse_args()
    SERVER = args.server
    PORT = args.port
    client()
