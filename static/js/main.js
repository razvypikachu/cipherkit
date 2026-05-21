const themeBtn = document.getElementById("theme-toggle");
if (themeBtn) {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
        document.body.classList.add("light");
        themeBtn.textContent = "☾";
    }
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const isLight = document.body.classList.contains("light");
        themeBtn.textContent = isLight ? "☾" : "☀";
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });
}
function getCounts() {
    return JSON.parse(localStorage.getItem("toolCounts") || "{}");
}

function incrementCount(tool) {
    const counts = getCounts();
    counts[tool] = (counts[tool] || 0) + 1;
    localStorage.setItem("toolCounts", JSON.stringify(counts));
}

function sortSidebar() {
    const counts = getCounts();
    const nav = document.querySelector(".tool-nav");
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll(".tool-link"));
    links.sort((a, b) => {
        const countA = counts[a.dataset.tool] || 0;
        const countB = counts[b.dataset.tool] || 0;
        return countB - countA;
    });

    links.forEach(link => {
        const countEl = link.querySelector(".tool-count");
        const count = counts[link.dataset.tool] || 0;
        if (countEl) countEl.textContent = count > 0 ? count : "";
        nav.appendChild(link);
    });
}

document.querySelectorAll(".tool-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const tool = link.dataset.tool;

        incrementCount(tool);
        sortSidebar();

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

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.display = "block";
    el.style.color = "#ef4444";
    el.style.borderColor = "#3a1a1a";
    el.innerHTML = `⚠ ${message}`;
}

function clearError(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.display = "none";
    el.style.color = "";
    el.style.borderColor = "";
    el.innerHTML = "";
}

const runHash = document.getElementById("run-hash");
if (runHash) {
    runHash.addEventListener("click", async () => {
        const text = document.getElementById("hash-input").value;
        if (!text) {
            showError("hash-output", "Please enter some text before hashing.");
            document.getElementById("hash-result").textContent = "";
            return;
        }
        clearError("hash-output");

        const response = await fetch("/hash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, algo: selectedAlgo })
        });

        const data = await response.json();
        const output = document.getElementById("hash-output");
        output.style.display = "block";
        output.style.color = "#4ade80";
        output.style.borderColor = "";
        output.innerHTML = `<span style="color:#333; margin-right:8px;">${selectedAlgo}:</span>${data.result}`;
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
        if (!text) {
            showError("encode-output", "Please enter some text before encoding/decoding.");
            document.getElementById("encode-result").textContent = "";
            return;
        }

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
            showError("encode-output", "Invalid input for this operation. Check your input and try again.");
            document.getElementById("encode-result").textContent = "";
            return;
        }

        const output = document.getElementById("encode-output");
        output.style.display = "block";
        output.style.color = "#4ade80";
        output.style.borderColor = "";
        document.getElementById("encode-result").textContent = result;
    });
}

const runPwned = document.getElementById("run-pwned");
if (runPwned) {
    runPwned.addEventListener("click", async () => {
        const password = document.getElementById("password-input").value;
        if (!password) {
            showError("pwned-output", "Please enter a password to check.");
            return;
        }

        const output = document.getElementById("pwned-output");
        output.style.display = "block";
        output.style.color = "#555";
        output.style.borderColor = "";
        output.textContent = "Checking...";

        try {
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
                output.textContent = `⚠ Found ${data.count.toLocaleString()} times in known data breaches. Consider using a different password.`;
            }
        } catch {
            showError("pwned-output", "Could not reach the breach database. Check your internet connection and try again.");
        }
    });
}

const contactSubmit = document.getElementById("contact-submit");
if (contactSubmit) {
    contactSubmit.addEventListener("click", () => {
        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const message = document.getElementById("contact-message").value.trim();

        const success = document.getElementById("contact-success");

        if (!name || !email || !message) {
            success.style.display = "block";
            success.style.color = "#ef4444";
            success.style.borderColor = "#3a1a1a";
            success.textContent = "⚠ Please fill in all fields before sending.";
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            success.style.display = "block";
            success.style.color = "#ef4444";
            success.style.borderColor = "#3a1a1a";
            success.textContent = "⚠ Please enter a valid email address.";
            return;
        }

        success.style.display = "block";
        success.style.color = "#4ade80";
        success.style.borderColor = "";
        success.textContent = "✓ Message sent successfully.";
        contactSubmit.textContent = "SENT ✓";
        contactSubmit.disabled = true;
    });
}

sortSidebar();