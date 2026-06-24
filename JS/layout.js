// =====================================
// 页面装饰：粒子背景
// =====================================

(function () {

    const container = document.getElementById("particlesContainer");

    if (!container) return;

    const colors = [
        "#4a8c78", "#c97d55", "#bf8c60",
        "#3a5f7a", "#b06868", "#7a8b9a", "#8fa0ad"
    ];

    for (let i = 0; i < 32; i++) {

        const p = document.createElement("div");

        if (i % 7 === 0) {
            p.className = "particle silver";
        } else {
            p.className = "particle";
        }

        const s = Math.random() * 3.2 + 1;

        p.style.width = s + "px";
        p.style.height = (i % 7 === 0 ? s * 0.5 : s) + "px";
        p.style.left = Math.random() * 86 + "%";
        p.style.animationDuration = (Math.random() * 14 + 6) + "s";
        p.style.animationDelay = (Math.random() * 12) + "s";
        p.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(p);

    }

})();
