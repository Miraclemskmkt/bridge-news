// ======================================
// 全卷收尾 · 贵州桥梁建设者语录词云（螺旋布局 · 绽放动效）
// ======================================

(function () {

    const dom = document.getElementById("builderWordcloud");
    if (!dom) return;

    const stage = dom.closest(".builder-wordcloud__stage");
    const FONT = window.BRIDGE_FONT || "Noto Serif SC, SimSun, serif";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wordFreq = {
        "毫米级": 20,
        "坚守": 18,
        "创新": 16,
        "突破": 16,
        "峡谷": 15,
        "世界第一高桥": 15,
        "风越大越要稳": 15,
        "高空": 14,
        "合龙": 14,
        "把论文写在大桥上": 14,
        "天堑变通途": 13,
        "万桥飞架": 13,
        "贵州奇迹": 12,
        "后发赶超": 12,
        "守护": 12,
        "巡检": 11,
        "养护": 11,
        "极端天气": 10,
        "逆行者": 10,
        "青年突击队": 10,
        "匠心": 10,
        "妈妈我想你了": 9,
        "安全": 9,
        "责任": 9,
        "品质": 9,
        "奉献": 9,
        "回家": 8,
        "团圆": 8,
        "守桥": 8,
        "跨越": 8,
        "奋斗": 8,
        "幸福": 8,
        "精准": 8,
        "挑战": 8,
        "极限": 8,
        "山河": 7,
        "连通": 7,
        "梦想": 7,
        "托起": 7,
        "未来": 7,
        "山区": 7,
        "腾飞": 7
    };

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let visible = false;
    let layoutIndex = 0;

    function tierClass(weight) {
        if (weight >= 18) return "builder-wordcloud__tag--xl";
        if (weight >= 14) return "builder-wordcloud__tag--lg";
        if (weight >= 11) return "builder-wordcloud__tag--md";
        if (weight >= 9) return "builder-wordcloud__tag--sm";
        return "builder-wordcloud__tag--xs";
    }

    function seedRotation(name) {
        let h = 0;
        for (let i = 0; i < name.length; i += 1) {
            h = (h * 31 + name.charCodeAt(i)) % 997;
        }
        return ((h % 19) - 9);
    }

    function seedFloat(name) {
        let h = 0;
        for (let i = 0; i < name.length; i += 1) {
            h = (h * 17 + name.charCodeAt(i)) % 991;
        }
        return {
            dur: 4.2 + (h % 28) / 10,
            delay: (h % 20) / 10
        };
    }

    function fontSize(weight, len, narrow) {
        const max = narrow ? 24 : 30;
        const min = narrow ? 11 : 12;
        let size = min + ((weight - 7) / 13) * (max - min);
        if (len > 5) size *= 0.92;
        if (len > 8) size *= 0.88;
        return Math.round(size);
    }

    function fontWeight(weight) {
        return weight >= 16 ? 900 : weight >= 14 ? 800 : weight >= 10 ? 700 : 600;
    }

    function measure(name, size, weight) {
        ctx.font = `${weight} ${size}px ${FONT}`;
        const m = ctx.measureText(name);
        return { w: m.width, h: size * 1.18 };
    }

    function boxesOverlap(a, b, pad) {
        return !(
            a.right + pad < b.left ||
            a.left - pad > b.right ||
            a.bottom + pad < b.top ||
            a.top - pad > b.bottom
        );
    }

    function layoutWords(animate) {
        const narrow = window.innerWidth <= 420;
        const W = dom.clientWidth;
        const H = dom.clientHeight;
        if (W < 40 || H < 40) return;

        const words = Object.keys(wordFreq)
            .map((name) => ({ name, weight: wordFreq[name] }))
            .sort((a, b) => b.weight - a.weight);

        const placed = [];
        const pad = narrow ? 6 : 7;
        const cx = W / 2;
        const cy = H / 2;
        let angle = -Math.PI / 2;
        let radius = 0;
        const angleStep = 0.38;
        const radiusStep = narrow ? 2 : 2.4;

        dom.classList.remove("is-visible");
        dom.innerHTML = "";
        layoutIndex = 0;

        words.forEach(({ name, weight }) => {
            const size = fontSize(weight, name.length, narrow);
            const fw = fontWeight(weight);
            const { w, h } = measure(name, size, fw);
            const rot = seedRotation(name);
            const float = seedFloat(name);

            let x = cx - w / 2;
            let y = cy - h / 2;
            let ok = false;
            let tries = 0;
            const maxTries = 1000;

            while (!ok && tries < maxTries) {
                x = cx + radius * Math.cos(angle) - w / 2;
                y = cy + radius * Math.sin(angle) * 0.86 - h / 2;

                const box = {
                    left: x,
                    top: y,
                    right: x + w,
                    bottom: y + h
                };

                const inBounds = box.left >= 6 && box.top >= 6 && box.right <= W - 6 && box.bottom <= H - 6;
                const hit = placed.some((p) => boxesOverlap(box, p, pad));

                if (inBounds && !hit) {
                    ok = true;
                    placed.push(box);
                } else {
                    angle += angleStep;
                    radius += radiusStep * (angleStep / (Math.PI * 2));
                    tries += 1;
                }
            }

            if (!ok) return;

            const vx = cx - (x + w / 2);
            const vy = cy - (y + h / 2);
            const tag = document.createElement("span");
            tag.className = `builder-wordcloud__tag ${tierClass(weight)}`;
            tag.setAttribute("role", "listitem");
            tag.textContent = name;
            tag.title = `语料权重 ${weight}`;
            tag.style.left = `${x}px`;
            tag.style.top = `${y}px`;
            tag.style.fontSize = `${size}px`;
            tag.style.fontWeight = String(fw);
            tag.style.setProperty("--rot", `${rot}deg`);
            tag.style.setProperty("--vx", `${vx}px`);
            tag.style.setProperty("--vy", `${vy}px`);
            tag.style.setProperty("--float-dur", `${float.dur}s`);
            tag.style.setProperty("--float-delay", `${float.delay}s`);
            tag.style.setProperty("--enter-delay", `${layoutIndex * 0.045}s`);
            tag.style.zIndex = String(Math.max(1, Math.round(weight - 4)));
            layoutIndex += 1;
            dom.appendChild(tag);
        });

        if (animate && visible && !reducedMotion) {
            requestAnimationFrame(() => {
                dom.classList.add("is-visible");
                if (stage) stage.classList.add("is-visible");
            });
        } else if (visible || reducedMotion) {
            dom.classList.add("is-visible", "is-static");
            if (stage) stage.classList.add("is-visible");
        }
    }

    dom.setAttribute("role", "list");

    let resizeTimer;
    function scheduleLayout() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => layoutWords(false), 100);
    }

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    visible = true;
                    layoutWords(true);
                }
            });
        }, { threshold: 0.12 }).observe(dom);
    } else {
        visible = true;
        layoutWords(true);
    }

    window.addEventListener("resize", scheduleLayout);
    window.addEventListener("load", () => {
        if (visible) layoutWords(false);
    });

})();
