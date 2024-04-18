## Server side for chrome extension
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import ssl

# AI
import pickle
from logisticRegression import LogisticRegression
from functionDefs import vectorize

model = None


class HTTPRequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "content-type")
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        data = self.rfile.read(content_length)
        json_data = json.loads(data.decode())
        message = json_data.get("message", "")

        emailData = json.loads(message)
        sender = emailData.get("from", "")
        subject = emailData.get("subject", "")
        raw_text = emailData.get("body", "")

        # If message does not contain email data, respond with error message
        if not sender:
            print("Data not received, Ensure SHOW ORIGINAL is enabled in Gmail")
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            response = {"message": "Ensure SHOW ORIGINAL is enabled"}
            self.wfile.write(json.dumps(response).encode())
            return

        print("Sender:", sender)
        print("Subject:", subject)
        print("Raw text:", raw_text)

        result = evaluate_email(raw_text, model)

        # Send response with CORS headers
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        # Add JSON response
        response = {"message": str(result) + "%"}
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


def load_model():
    global model
    with open("logistic_regression_model.pkl", "rb") as file:
        model = pickle.load(file)
    print("Model loaded...")


def evaluate_email(email, model):
    print("Evaluating email...")
    feature_vector = vectorize(email)
    probability = model.predict_proba(feature_vector)
    print("Email evaluated...")
    print("Probability:", probability[2])
    return round(probability[2] * 100, 2)


if __name__ == "__main__":
    load_model()
    run()
