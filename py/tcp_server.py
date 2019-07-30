import socket

def server():
    host = socket.gethostname()
    port = 8080

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((host, port))

    s.listen(1)
    c, addr = s.accept()

    print("Connection from: " + str(addr))
    try:
        while True:
            data = c.recv(1024).decode('utf-8')
            if not data:
              break
            print('peer: ' + data)
            msg = input('==> ')
            c.send(msg.encode('utf-8'))
    except KeyboardInterrupt:
        c.close()
        exit(0)


if __name__ == '__main__':
    server()
