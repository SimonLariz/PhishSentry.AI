## Server side for chrome extension
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import ssl


class HTTPRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        data = self.rfile.read(content_length)
        print("Received data: ", data.decode())

        # Send response with CORS headers
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        # Add json response
        response = "{'Message': 'Data received'}"
        self.wfile.write(json.dumps(response).encode())


def run(server_class=HTTPServer, handler_class=HTTPRequestHandler):
    server_address = ("", 4443)
    httpd = server_class(server_address, handler_class)
    httpd.socket = ssl.wrap_socket(
        httpd.socket,
        server_side=True,
        certfile="cert.pem",
        keyfile="key.pem",
        ssl_version=ssl.PROTOCOL_TLS,
    )
    print("Starting httpd on " + "https://localhost:4443/")
    httpd.serve_forever()


if __name__ == "__main__":
    run()
