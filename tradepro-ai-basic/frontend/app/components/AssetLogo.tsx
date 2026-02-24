"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type AssetLogoProps = {
  symbol: string;
  size?: "sm" | "md";
};

const cryptoSymbols = new Set(["BTC", "ETH", "SOL", "XRP"]);

const cryptoLogoBySymbol: Record<string, string> = {
  BTC: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
  ETH: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  SOL: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
  XRP: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
};

const stockDomainBySymbol: Record<string, string> = {
  AAPL: "apple.com",
  TSLA: "tesla.com",
  NVDA: "nvidia.com",
  MSFT: "microsoft.com",
  AMZN: "amazon.com",
  GOOGL: "google.com",
  META: "meta.com",
  BRK: "berkshirehathaway.com",
  AVGO: "broadcom.com",
  LLY: "lilly.com",
  WMT: "walmart.com",
};

function getLogoCandidates(base: string, isCrypto: boolean) {
  if (isCrypto) {
    const logo = cryptoLogoBySymbol[base];
    return logo ? [logo] : [];
  }

  const candidates = [
    `https://financialmodelingprep.com/image-stock/${base}.png`,
  ];

  const domain = stockDomainBySymbol[base];
  if (domain) {
    candidates.push(`https://logo.clearbit.com/${domain}`);
  }

  return candidates;
}

function normalizeBaseSymbol(symbol: string) {
  return symbol.toUpperCase().replace("USDT", "").replace("-USD", "");
}

function getDisplayLabel(base: string) {
  if (base.length <= 3) return base;
  return base.slice(0, 4);
}

export function AssetLogo({ symbol, size = "sm" }: AssetLogoProps) {
  const base = useMemo(() => normalizeBaseSymbol(symbol), [symbol]);
  const isCrypto = cryptoSymbols.has(base);
  const logoCandidates = useMemo(() => getLogoCandidates(base, isCrypto), [base, isCrypto]);
  const [logoIndex, setLogoIndex] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setLogoIndex(0);
    setUseFallback(false);
  }, [symbol]);

  const logoUrl = logoCandidates[logoIndex];

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border",
        size === "sm" ? "h-5 w-5" : "h-6 w-6",
        isCrypto ? "border-emerald-500/40 bg-emerald-500/10" : "border-zinc-700 bg-zinc-900"
      )}
    >
      {logoUrl && !useFallback ? (
        <img
          src={logoUrl}
          alt={`${base} logo`}
          loading="lazy"
          onError={() => {
            if (logoIndex + 1 < logoCandidates.length) {
              setLogoIndex((prev) => prev + 1);
              return;
            }

            setUseFallback(true);
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={cn(
            "font-semibold tracking-wide",
            isCrypto ? "text-[9px] text-emerald-300" : "text-[9px] text-zinc-200"
          )}
        >
          {getDisplayLabel(base)}
        </span>
      )}
    </div>
  );
}
