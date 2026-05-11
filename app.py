from flask import Flask, render_template,request, jsonify
import hashlib

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/hash", methods=["POST"])
def hash_text():
    data = request.get_json()
    text = data["text"]
    algo = data["algo"]
    if algo == "MD5":
        result = hashlib.md5(text.encode()).hexdigest()
    elif algo == "SHA256":
        result = hashlib.sha256(text.encode()).hexdigest()
    elif algo == "SHA512":
        result = hashlib.sha512(text.encode()).hexdigest()
    else:
        result = "unsupported algorithm"
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run(debug=True)