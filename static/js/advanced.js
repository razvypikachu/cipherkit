document.querySelectorAll(".tool-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const tool = link.dataset.tool;

        document.querySelectorAll(".tool-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        document.querySelectorAll(".tool-section").forEach(s => s.style.display = "none");
        document.getElementById("tool-" + tool).style.display = "block";

        const titles = { nmap: "Nmap", whois: "Whois" };
        document.getElementById("panel-title").textContent = titles[tool];
    });
});

document.getElementById("run-nmap").addEventListener("click", async () => {
    const target = document.getElementById("nmap-target").value;
    if (!target) return;

    const flags = document.getElementById("nmap-flags").value;
    const output = document.getElementById("nmap-output");
    output.style.display = "block";
    output.textContent = "Running nmap, please wait...";

    const response = await fetch("/run/nmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: target, flags: flags })
    });

    const data = await response.json();
    output.textContent = data.output;
});

document.getElementById("run-whois").addEventListener("click", async () => {
    const target = document.getElementById("whois-target").value;
    if (!target) return;

    const output = document.getElementById("whois-output");
    output.style.display = "block";
    output.textContent = "Running whois...";

    const response = await fetch("/run/whois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: target })
    });

    const data = await response.json();
    output.textContent = data.output;
});