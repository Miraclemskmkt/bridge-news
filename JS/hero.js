// ======================================
// 数字开篇墙 · 对应 之前/1.数字开篇墙.py
// ======================================

(function () {

    const heroData = [
        {
            value: "92.5%",
            label: "山地丘陵占比",
            detail: "92.5%：贵州山地丘陵面积占比，相当于每10平方公里中9.25平方公里是山地。"
        },
        {
            value: "17个",
            label: "世居少数民族",
            detail: "17个世居少数民族：苗族、布依族、侗族、土家族、彝族、仡佬族、水族等。数据来源：贵州省民宗委。"
        },
        {
            value: "3.2万座",
            label: "桥梁总数",
            detail: "3.2万座桥梁：截至2024年底贵州桥梁总数，相当于每10平方公里约有1座桥。"
        },
        {
            value: "47座",
            label: "全球前100高桥",
            detail: "全球前100座高桥中，贵州占47座，并包揽前三名（花江峡谷大桥625m、北盘江大桥565m、坝陵河大桥370m）。"
        },
        {
            value: "625m",
            label: "世界第一高桥",
            detail: "625米：花江峡谷大桥桥面至谷底垂直高度，世界最高桥，相当于200层楼高。"
        }
    ];

    function showDetail(msg) {
        if (!msg) return;

        const popup = document.createElement("div");
        popup.className = "data-popup";
        popup.textContent = msg;
        document.body.appendChild(popup);

        popup.addEventListener("click", () => popup.remove());
        setTimeout(() => {
            if (document.body.contains(popup)) popup.remove();
        }, 3600);
    }

    function buildHeroWall() {

        const heroContainer = document.getElementById("heroWall");
        if (!heroContainer) return;

        heroContainer.replaceChildren();

        const title = document.createElement("h2");
        title.className = "hero-wall-title";
        title.textContent = "山的宿命 · 桥的答卷";
        heroContainer.appendChild(title);

        const list = document.createElement("div");
        list.className = "hero-wall-items";
        heroContainer.appendChild(list);

        heroData.forEach((item, index) => {

            const block = document.createElement("div");
            block.className = "hero-wall-item";

            const value = document.createElement("div");
            value.className = "hero-wall-value";
            value.textContent = item.value;
            value.style.animationDelay = `${(index * 0.12 + 0.08).toFixed(2)}s`;
            value.dataset.detail = item.detail;
            value.tabIndex = 0;
            value.setAttribute("role", "button");
            value.setAttribute("aria-label", `${item.value}，${item.label}`);

            const label = document.createElement("p");
            label.className = "hero-wall-label";
            label.textContent = item.label;

            block.appendChild(value);
            block.appendChild(label);
            list.appendChild(block);

            const openDetail = () => showDetail(item.detail);
            value.addEventListener("click", openDetail);
            value.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDetail();
                }
            });

        });

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildHeroWall);
    } else {
        buildHeroWall();
    }

})();
