# CipherKit

A web-based cybersecurity toolkit built with Flask. Includes lightweight browser tools and advanced tools powered by real security utilities.

## Tools

**Lightweight**
- Hash Checker — MD5, SHA256, SHA512
- Password Strength — real-time analysis + Have I Been Pwned check
- Encoder / Decoder — Base64, Hex, URL

**Advanced**
- Nmap — network scanner
- Whois — domain lookup

## Run with Docker

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.

```bash
git clone https://github.com/razvypikachu/cipherkit.git
cd cipherkit
docker build -t cipherkit .
docker run -p 5000:5000 cipherkit
```

Then open `http://localhost:5000` in your browser.

## Run locally (Mac/Linux)

```bash
git clone https://github.com/razvypikachu/cipherkit.git
cd cipherkit
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

Requires `nmap` and `whois` installed on your system.

## Tech Stack

- Python / Flask
- HTML, CSS, JavaScript
- Docker
- Nmap, Whois

## Author

[github.com/razvypikachu](https://github.com/razvypikachu)