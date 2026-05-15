document.querySelectorAll(".tool-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const tool = link.dataset.tool;

        document.querySelectorAll(".tool-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        document.querySelectorAll(".tool-section").forEach(s => s.style.display = "none");
        document.getElementById("tool-" + tool).style.display = "block";
        const titles = { hash: "Hash Checker", password: "Password Strength", encode: "Encoder / Decoder" };
        const panelTitle = document.getElementById("panel-title");
        if (panelTitle) panelTitle.textContent = titles[tool];
    });
});

let selectedAlgo = "MD5";
document.querySelectorAll(".algo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".algo-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedAlgo = btn.dataset.algo;
    });
});

const runHash = document.getElementById("run-hash");
if (runHash) {
    runHash.addEventListener("click", async () => {
        const text = document.getElementById("hash-input").value;
        if (!text) return;

        const response = await fetch("/hash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, algo: selectedAlgo })
        });

        const data = await response.json();
        document.getElementById("hash-result").textContent = data.result;
        document.getElementById("hash-output").style.display = "block";
    });
}

const passwordInput = document.getElementById("password-input");
if (passwordInput) {
    passwordInput.addEventListener("input", () => {
        const pw = passwordInput.value;
        if (!pw) {
            document.getElementById("password-result").style.display = "none";
            return;
        }
        document.getElementById("password-result").style.display = "block";
        const checks = [
            { label: "Length ≥ 8",         pass: pw.length >= 8 },
            { label: "Length ≥ 14",        pass: pw.length >= 14 },
            { label: "Uppercase letters",  pass: /[A-Z]/.test(pw) },
            { label: "Numbers",            pass: /[0-9]/.test(pw) },
            { label: "Special characters", pass: /[^A-Za-z0-9]/.test(pw) },
        ];
        const score = checks.filter(c => c.pass).length;
        const colors = ["", "#ef4444", "#f97316", "#eab308", "#4ade80", "#22d3ee"];
        const labels = ["", "Weak", "Weak", "Moderate", "Strong", "Very Strong"];
        for (let i = 1; i <= 5; i++) {
            document.getElementById("bar-" + i).style.background = i <= score ? colors[score] : "#1e1e1e";
        }
        document.getElementById("strength-label").textContent = labels[score];
        document.getElementById("strength-label").style.color = colors[score];
        const checklist = document.getElementById("checklist");
        checklist.innerHTML = "";
        checks.forEach(c => {
            const item = document.createElement("div");
            item.className = "check-item";
            item.innerHTML = `<span style="color: ${c.pass ? "#4ade80" : "#ef4444"}">${c.pass ? "✓" : "✗"}</span> ${c.label}`;
            checklist.appendChild(item);
        });
    });
}

let selectedFormat = "base64";
let selectedMode = "encode";

document.querySelectorAll("[data-format]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("[data-format]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedFormat = btn.dataset.format;
    });
});

document.querySelectorAll("[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("[data-mode]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedMode = btn.dataset.mode;
    });
});

const runEncode = document.getElementById("run-encode");
if (runEncode) {
    runEncode.addEventListener("click", () => {
        const text = document.getElementById("encode-input").value;
        if (!text) return;

        let result;
        try {
            if (selectedFormat === "base64") {
                result = selectedMode === "encode" ? btoa(text) : atob(text);
            } else if (selectedFormat === "hex") {
                result = selectedMode === "encode"
                    ? Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ")
                    : text.split(" ").map(h => String.fromCharCode(parseInt(h, 16))).join("");
            } else if (selectedFormat === "url") {
                result = selectedMode === "encode" ? encodeURIComponent(text) : decodeURIComponent(text);
            }
        } catch {
            result = "⚠ Invalid input for this operation";
        }

        document.getElementById("encode-result").textContent = result;
        document.getElementById("encode-output").style.display = "block";
    });
}

const runPwned = document.getElementById("run-pwned");
if (runPwned) {
    runPwned.addEventListener("click", async () => {
        const password = document.getElementById("password-input").value;
        if (!password) return;

        const output = document.getElementById("pwned-output");
        output.style.display = "block";
        output.textContent = "Checking...";

        const response = await fetch("/checkpwned", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: password })
        });

        const data = await response.json();

        if (data.count === 0) {
            output.style.color = "#4ade80";
            output.textContent = "✓ Not found in any known data breaches.";
        } else {
            output.style.color = "#ef4444";
            output.textContent = `⚠ Found ${data.count.toLocaleString()} times in known data breaches.`;
        }
    });
}