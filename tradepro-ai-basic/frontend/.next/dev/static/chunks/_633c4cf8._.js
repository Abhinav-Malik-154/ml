(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/sonner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function Toaster() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
        richColors: true,
        theme: "dark",
        closeButton: true,
        toastOptions: {
            classNames: {
                toast: "border border-zinc-700 bg-zinc-900 text-zinc-100",
                description: "text-zinc-300"
            }
        }
    }, void 0, false, {
        fileName: "[project]/components/ui/sonner.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Toaster;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", {
    variants: {
        variant: {
            default: "border-zinc-700 bg-zinc-800 text-zinc-100",
            positive: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
            negative: "border-rose-500/40 bg-rose-500/15 text-rose-300",
            neutral: "border-zinc-600 bg-zinc-800 text-zinc-300"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/badge.tsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0 bg-zinc-800", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/separator.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = Separator;
;
var _c;
__turbopack_context__.k.register(_c, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/TopTicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopTicker",
    ()=>TopTicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const symbols = [
    {
        symbol: "BTCUSDT",
        type: "crypto"
    },
    {
        symbol: "ETHUSDT",
        type: "crypto"
    },
    {
        symbol: "SOLUSDT",
        type: "crypto"
    },
    {
        symbol: "XRPUSDT",
        type: "crypto"
    },
    {
        symbol: "AAPL",
        type: "stock"
    },
    {
        symbol: "TSLA",
        type: "stock"
    },
    {
        symbol: "NVDA",
        type: "stock"
    },
    {
        symbol: "MSFT",
        type: "stock"
    }
];
function labelFromSymbol(symbol) {
    return symbol.replace("USDT", "");
}
function formatPrice(value) {
    if (!value || Number.isNaN(value)) return "--";
    return value > 100 ? value.toFixed(2) : value.toFixed(4);
}
function TopTicker() {
    _s();
    const [prices, setPrices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [directions, setDirections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const applyPrices = (nextPrices)=>{
        setPrices((prev)=>{
            const updated = {
                ...prev
            };
            const nextDirections = {};
            Object.entries(nextPrices).forEach(([symbol, nextPrice])=>{
                const previous = prev[symbol];
                nextDirections[symbol] = previous === undefined || previous === nextPrice ? "flat" : nextPrice > previous ? "up" : "down";
                updated[symbol] = nextPrice;
            });
            if (Object.keys(nextDirections).length > 0) {
                setDirections((prevDirections)=>({
                        ...prevDirections,
                        ...nextDirections
                    }));
            }
            return updated;
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopTicker.useEffect": ()=>{
            const streams = symbols.filter({
                "TopTicker.useEffect.streams": (item)=>item.type === "crypto"
            }["TopTicker.useEffect.streams"]).map({
                "TopTicker.useEffect.streams": (item)=>`${item.symbol.toLowerCase()}@miniTicker`
            }["TopTicker.useEffect.streams"]).join("/");
            const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
            ws.onmessage = ({
                "TopTicker.useEffect": (event)=>{
                    try {
                        const payload = JSON.parse(event.data);
                        const symbol = payload?.data?.s;
                        const close = payload?.data?.c;
                        if (!symbol || !close) return;
                        applyPrices({
                            [symbol]: Number(close)
                        });
                    } catch  {
                        return;
                    }
                }
            })["TopTicker.useEffect"];
            return ({
                "TopTicker.useEffect": ()=>ws.close()
            })["TopTicker.useEffect"];
        }
    }["TopTicker.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopTicker.useEffect": ()=>{
            let cancelled = false;
            const fetchStocks = {
                "TopTicker.useEffect.fetchStocks": async ()=>{
                    const stockSymbols = symbols.filter({
                        "TopTicker.useEffect.fetchStocks.stockSymbols": (item)=>item.type === "stock"
                    }["TopTicker.useEffect.fetchStocks.stockSymbols"]).map({
                        "TopTicker.useEffect.fetchStocks.stockSymbols": (item)=>item.symbol
                    }["TopTicker.useEffect.fetchStocks.stockSymbols"]);
                    const responses = await Promise.allSettled(stockSymbols.map({
                        "TopTicker.useEffect.fetchStocks": (symbol)=>fetch(`/api/current-price?symbol=${symbol}`).then({
                                "TopTicker.useEffect.fetchStocks": (res)=>res.ok ? res.json() : null
                            }["TopTicker.useEffect.fetchStocks"])
                    }["TopTicker.useEffect.fetchStocks"]));
                    if (cancelled) return;
                    const nextPrices = {};
                    responses.forEach({
                        "TopTicker.useEffect.fetchStocks": (result, index)=>{
                            if (result.status !== "fulfilled" || !result.value) return;
                            const body = result.value;
                            const nestedData = typeof body.data === "object" && body.data !== null ? body.data : undefined;
                            const price = Number(body.price ?? body.currentPrice ?? body.current_price ?? nestedData?.price ?? nestedData?.current_price);
                            if (Number.isFinite(price)) {
                                nextPrices[stockSymbols[index]] = price;
                            }
                        }
                    }["TopTicker.useEffect.fetchStocks"]);
                    if (Object.keys(nextPrices).length > 0) {
                        applyPrices(nextPrices);
                    }
                }
            }["TopTicker.useEffect.fetchStocks"];
            fetchStocks();
            const id = setInterval(fetchStocks, 3000);
            return ({
                "TopTicker.useEffect": ()=>{
                    cancelled = true;
                    clearInterval(id);
                }
            })["TopTicker.useEffect"];
        }
    }["TopTicker.useEffect"], []);
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TopTicker.useMemo[items]": ()=>[
                ...symbols,
                ...symbols
            ]
    }["TopTicker.useMemo[items]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-40 h-11 overflow-hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "ticker-track flex h-full min-w-max items-center gap-3 px-4",
            children: items.map((item, index)=>{
                const price = prices[item.symbol];
                const direction = directions[item.symbol] ?? "flat";
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "neutral",
                            className: "tracking-wide",
                            children: labelFromSymbol(item.symbol)
                        }, void 0, false, {
                            fileName: "[project]/app/components/TopTicker.tsx",
                            lineNumber: 136,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: direction === "up" ? "text-xs font-medium text-emerald-400" : direction === "down" ? "text-xs font-medium text-rose-400" : "text-xs text-zinc-300",
                            children: [
                                direction === "up" ? "▲ " : direction === "down" ? "▼ " : "",
                                formatPrice(price)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TopTicker.tsx",
                            lineNumber: 139,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                            orientation: "vertical",
                            className: "h-4"
                        }, void 0, false, {
                            fileName: "[project]/app/components/TopTicker.tsx",
                            lineNumber: 151,
                            columnNumber: 15
                        }, this)
                    ]
                }, `${item.symbol}-${index}`, true, {
                    fileName: "[project]/app/components/TopTicker.tsx",
                    lineNumber: 135,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/app/components/TopTicker.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/TopTicker.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_s(TopTicker, "O8GRxbeCmbfxI+SJtkkKEJt2BGk=");
_c = TopTicker;
var _c;
__turbopack_context__.k.register(_c, "TopTicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_633c4cf8._.js.map