let selectedAlgo = "MD5";
document.quertSelectorAll(".algo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.quertSelectorAll(".algo-btn"),forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        selectedAlgo = btn.dataset.algo;
    });
});
document.getElementById("hash-btn").addEventListener("click", async () => {
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
