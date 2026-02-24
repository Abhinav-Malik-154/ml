"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BrandLogo } from "@/app/components/BrandLogo";
import { AssetLogo } from "@/app/components/AssetLogo";

type TickerSymbol = {
  symbol: string;
  type: "crypto" | "stock";
};

const symbols: TickerSymbol[] = [
  { symbol: "BTCUSDT", type: "crypto" },
  { symbol: "ETHUSDT", type: "crypto" },
  { symbol: "SOLUSDT", type: "crypto" },
  { symbol: "XRPUSDT", type: "crypto" },
  { symbol: "AAPL", type: "stock" },
  { symbol: "TSLA", type: "stock" },
  { symbol: "NVDA", type: "stock" },
  { symbol: "MSFT", type: "stock" },
];

function labelFromSymbol(symbol: string) {
  return symbol.replace("USDT", "");
}

function formatPrice(value?: number) {
  if (!value || Number.isNaN(value)) return "--";
  return value > 100 ? value.toFixed(2) : value.toFixed(4);
}

export function TopTicker() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [directions, setDirections] = useState<Record<string, "up" | "down" | "flat">>({});

  const applyPrices = (nextPrices: Record<string, number>) => {
    setPrices((prev) => {
      const updated = { ...prev };
      const nextDirections: Record<string, "up" | "down" | "flat"> = {};

      Object.entries(nextPrices).forEach(([symbol, nextPrice]) => {
        const previous = prev[symbol];
        nextDirections[symbol] =
          previous === undefined || previous === nextPrice ? "flat" : nextPrice > previous ? "up" : "down";
        updated[symbol] = nextPrice;
      });

      if (Object.keys(nextDirections).length > 0) {
        setDirections((prevDirections) => ({ ...prevDirections, ...nextDirections }));
      }

      return updated;
    });
  };

  useEffect(() => {
    const streams = symbols
      .filter((item) => item.type === "crypto")
      .map((item) => `${item.symbol.toLowerCase()}@miniTicker`)
      .join("/");

    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { data?: { s?: string; c?: string } };
        const symbol = payload?.data?.s;
        const close = payload?.data?.c;
        if (!symbol || !close) return;

        applyPrices({ [symbol]: Number(close) });
      } catch {
        return;
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchStocks = async () => {
      const stockSymbols = symbols.filter((item) => item.type === "stock").map((item) => item.symbol);
      const responses = await Promise.allSettled(
        stockSymbols.map((symbol) =>
          fetch(`/api/current-price?symbol=${symbol}`).then((res) => (res.ok ? res.json() : null))
        )
      );

      if (cancelled) return;

      const nextPrices: Record<string, number> = {};
      responses.forEach((result, index) => {
        if (result.status !== "fulfilled" || !result.value) return;
        const body = result.value as Record<string, unknown>;
        const nestedData =
          typeof body.data === "object" && body.data !== null
            ? (body.data as Record<string, unknown>)
            : undefined;
        const price = Number(
          body.price ??
            body.currentPrice ??
            body.current_price ??
            nestedData?.price ??
            nestedData?.current_price
        );
        if (Number.isFinite(price)) {
          nextPrices[stockSymbols[index]] = price;
        }
      });

      if (Object.keys(nextPrices).length > 0) {
        applyPrices(nextPrices);
      }
    };

    fetchStocks();
    const id = setInterval(fetchStocks, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const items = useMemo(() => [...symbols, ...symbols], []);

  return (
    <header className="sticky top-0 z-40 h-11 overflow-hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="flex h-full items-stretch">
        <div className="flex shrink-0 items-center border-r border-zinc-800 px-3">
          <BrandLogo compact />
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track flex h-full min-w-max items-center gap-3 px-4">
            {items.map((item, index) => {
              const price = prices[item.symbol];
              const direction = directions[item.symbol] ?? "flat";
              return (
                <div key={`${item.symbol}-${index}`} className="flex items-center gap-2">
                  <AssetLogo symbol={item.symbol} />
                  <Badge variant="neutral" className="tracking-wide">
                    {labelFromSymbol(item.symbol)}
                  </Badge>
                  <span
                    className={
                      direction === "up"
                        ? "text-xs font-medium text-emerald-400"
                        : direction === "down"
                          ? "text-xs font-medium text-rose-400"
                          : "text-xs text-zinc-300"
                    }
                  >
                    {direction === "up" ? "▲ " : direction === "down" ? "▼ " : ""}
                    {formatPrice(price)}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
