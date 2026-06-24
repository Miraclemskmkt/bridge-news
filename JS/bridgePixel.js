// =====================================
// 3.2万座桥像素阵列 · 贵州地图轮廓
// =====================================

(function () {

    const dom = document.getElementById("bridgePixel");
    if (!dom) return;

    const chart = echarts.init(dom);
    const BRIDGE_TOTAL = 32000;

    function simplifyRing(ring, maxPoints) {
        if (ring.length <= maxPoints) return ring;
        const step = Math.ceil(ring.length / maxPoints);
        const out = [];
        for (let i = 0; i < ring.length; i += step) out.push(ring[i]);
        const last = ring[ring.length - 1];
        const tail = out[out.length - 1];
        if (!tail || tail[0] !== last[0] || tail[1] !== last[1]) out.push(last);
        return out;
    }

    function pointInRing(lng, lat, ring) {
        let inside = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const xi = ring[i][0], yi = ring[i][1];
            const xj = ring[j][0], yj = ring[j][1];
            if (((yi > lat) !== (yj > lat)) &&
                (lng < (xj - xi) * (lat - yi) / (yj - yi + 1e-12) + xi)) {
                inside = !inside;
            }
        }
        return inside;
    }

    function pointInRegion(lng, lat, rings) {
        return rings.some((ring) => pointInRing(lng, lat, ring));
    }

    function extractRegions(geoJson) {
        return geoJson.features.map((feature) => {
            const geom = feature.geometry;
            const polys = geom.type === "MultiPolygon"
                ? geom.coordinates
                : [geom.coordinates];

            const rings = polys.map((poly) => simplifyRing(poly[0], 90));
            const lngs = [];
            const lats = [];

            polys.forEach((poly) => {
                poly[0].forEach(([lng, lat]) => {
                    lngs.push(lng);
                    lats.push(lat);
                });
            });

            return {
                name: feature.properties.name,
                rings,
                bbox: {
                    minLng: Math.min(...lngs),
                    maxLng: Math.max(...lngs),
                    minLat: Math.min(...lats),
                    maxLat: Math.max(...lats)
                }
            };
        });
    }

    function generateBridgePixels(regions) {
        const perRegion = Math.ceil(BRIDGE_TOTAL / regions.length);
        const pixels = [];

        regions.forEach((region) => {
            const { bbox, rings } = region;
            let count = 0;
            let attempts = 0;
            const maxAttempts = perRegion * 40;

            while (count < perRegion && attempts < maxAttempts) {
                attempts += 1;
                const lng = bbox.minLng + Math.random() * (bbox.maxLng - bbox.minLng);
                const lat = bbox.minLat + Math.random() * (bbox.maxLat - bbox.minLat);

                if (pointInRegion(lng, lat, rings)) {
                    pixels.push([lng, lat, 2010 + Math.floor(Math.random() * 16)]);
                    count += 1;
                }
            }
        });

        while (pixels.length < BRIDGE_TOTAL) {
            const sample = pixels[Math.floor(Math.random() * pixels.length)];
            pixels.push([
                sample[0] + (Math.random() - 0.5) * 0.015,
                sample[1] + (Math.random() - 0.5) * 0.015,
                2010 + Math.floor(Math.random() * 16)
            ]);
        }

        return pixels.slice(0, BRIDGE_TOTAL);
    }

    function buildOption(bridgePixels) {
        return {
            backgroundColor: "transparent",
            tooltip: {
                trigger: "item",
                formatter: (p) => {
                    if (!p.value || p.value.length < 3) return "";
                    return `建成年份：${p.value[2]}`;
                }
            },
            geo: {
                map: "guizhou",
                roam: false,
                center: [106.75, 26.75],
                zoom: 1.12,
                layoutCenter: ["46%", "46%"],
                layoutSize: "72%",
                itemStyle: {
                    areaColor: "rgba(234, 240, 234, 0.55)",
                    borderColor: "#4A7C65",
                    borderWidth: 1.4,
                    shadowColor: "rgba(74, 124, 101, 0.12)",
                    shadowBlur: 8
                },
                emphasis: {
                    disabled: true
                },
                label: { show: false },
                silent: true
            },
            visualMap: {
                min: 2010,
                max: 2025,
                dimension: 2,
                orient: "vertical",
                right: 6,
                top: "middle",
                itemWidth: 10,
                itemHeight: 88,
                text: ["新", "旧"],
                textGap: 6,
                textStyle: { color: "#4A7C65", fontSize: 10 },
                inRange: {
                    color: ["#D1E7DD", "#8CBFAA", "#6D9B8B", "#4A7C65"]
                }
            },
            series: [
                {
                    name: "桥梁",
                    type: "scatter",
                    coordinateSystem: "geo",
                    data: bridgePixels,
                    symbolSize: 1.8,
                    itemStyle: { opacity: 0.78 },
                    z: 3
                }
            ]
        };
    }

    function showError(msg) {
        chart.setOption({
            backgroundColor: "transparent",
            title: {
                text: msg,
                left: "center",
                top: "middle",
                textStyle: { color: "#7a8b9a", fontSize: 13, fontWeight: "normal" }
            }
        });
    }

    function loadGeoJson() {
        return new Promise((resolve, reject) => {
            if (window.GUIZHOU_GEOJSON) {
                resolve(window.GUIZHOU_GEOJSON);
                return;
            }
            fetch("data/guizhou.json")
                .then((r) => {
                    if (!r.ok) throw new Error("fetch failed");
                    return r.json();
                })
                .then(resolve)
                .catch(reject);
        });
    }

    function render(geoJson) {
        echarts.registerMap("guizhou", geoJson);
        const regions = extractRegions(geoJson);
        const bridgePixels = generateBridgePixels(regions);
        chart.setOption(buildOption(bridgePixels), true);
        chart.resize();
    }

    function init() {
        loadGeoJson()
            .then(render)
            .catch(() => showError("地图数据加载失败"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.addEventListener("resize", () => chart.resize());

    window.addEventListener("load", () => {
        setTimeout(() => chart.resize(), 100);
        setTimeout(() => chart.resize(), 500);
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) chart.resize();
            });
        }, { threshold: 0.1 });
        observer.observe(dom);
    }

})();
