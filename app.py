from flask import Flask, render_template,request, jsonify
import hashlib
import requests
import subprocess
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

@app.route("/advanced")
def advanced():
    return render_template("advanced.html")
@app.route("/checkpwned", methods=["POST"])
def check_pwned():
    data = request.get_json()
    password = data["password"]
    
    sha1 = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix = sha1[:5]
    suffix = sha1[5:]
    
    response = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}")
    hashes = response.text.splitlines()
    
    for line in hashes:
        h, count = line.split(":")
        if h == suffix:
            return jsonify({"count": int(count)})
    
    return jsonify({"count": 0})
@app.route("/run/nmap", methods=["POST"])
@app.route("/run/nmap", methods=["POST"])
def run_nmap():
    data = request.get_json()
    target = data["target"]
    flags = data.get("flags", "")
    
    cmd = ["nmap", "-T4"] + flags.split() + [target]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    
    return jsonify({"output": result.stdout or result.stderr})
@app.route("/run/whois", methods=["POST"])
def run_whois():
    data = request.get_json()
    target = data["target"]
    
    result = subprocess.run(["whois", target], capture_output=True, text=True, timeout=10)
    
    return jsonify({"output": result.stdout or result.stderr})
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")