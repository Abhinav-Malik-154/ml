"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { TradingChart, type CandlePoint, type PredictionPoint } from "@/app/components/TradingChart";
import { BrandLogo } from "@/app/components/BrandLogo";
import { AssetLogo } from "@/app/components/AssetLogo";
import FinancialSankey from "@/app/components/FinancialSankey";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { apiGet, apiPost } from "@/lib/api";
import { cn } from "@/lib/utils";

type WatchSymbol = {
  symbol: string;
  label: string;
  type: "crypto" | "stock";
};

type NewsItem = {
  title: string;
  sentiment: "positive" | "negative" | "neutral";
  source?: string;
};

type Forecast = {
  currentPrice: number;
  predictedPrice: number;
  expectedChangePct: number;
  recommendation: string;
  confidence: number;
};

type PriceDirection = "up" | "down" | "flat";

const symbols: WatchSymbol[] = [
  { symbol: "BTCUSDT", label: "BTC", type: "crypto" },
  { symbol: "ETHUSDT", label: "ETH", type: "crypto" },
  { symbol: "SOLUSDT", label: "SOL", type: "crypto" },
  { symbol: "XRPUSDT", label: "XRP", type: "crypto" },
  { symbol: "AAPL", label: "AAPL", type: "stock" },
  { symbol: "TSLA", label: "TSLA", type: "stock" },
  { symbol: "NVDA", label: "NVDA", type: "stock" },
  { symbol: "MSFT", label: "MSFT", type: "stock" },
];

const horizons = [
  { label: "1 Day", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
];

function asNumber(input: unknown): number {
  const n = Number(input);
  return Number.isFinite(n) ? n : 0;
}

function toTimestamp(raw: unknown): number {
  if (typeof raw === "number") {
    if (raw > 1_000_000_000_000) return Math.floor(raw / 1000);
    return Math.floor(raw);
  }

  if (typeof raw === "string") {
    const numeric = Number(raw);
    if (!Number.isNaN(numeric)) {
      return toTimestamp(numeric);
    }

    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) return Math.floor(parsed / 1000);
  }

  return Math.floor(Date.now() / 1000);
}

function normalizeCandles(payload: unknown): CandlePoint[] {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as Record<string, unknown>)?.data)
      ? ((payload as Record<string, unknown>).data as unknown[])
      : Array.isArray((payload as Record<string, unknown>)?.candles)
        ? ((payload as Record<string, unknown>).candles as unknown[])
        : [];

  const points = source
    .map((entry) => {
      if (Array.isArray(entry) && entry.length >= 5) {
        return {
          time: toTimestamp(entry[0]) as CandlePoint["time"],
          open: asNumber(entry[1]),
          high: asNumber(entry[2]),
          low: asNumber(entry[3]),
          close: asNumber(entry[4]),
        };
      }

      if (typeof entry === "object" && entry) {
        const item = entry as Record<string, unknown>;
        return {
          time: toTimestamp(item.time ?? item.timestamp ?? item.date) as CandlePoint["time"],
          open: asNumber(item.open),
          high: asNumber(item.high),
          low: asNumber(item.low),
          close: asNumber(item.close),
        };
      }

      return null;
    })
    .filter((value): value is CandlePoint => Boolean(value))
    .filter((value) => value.open && value.high && value.low && value.close)
    .sort((a, b) => a.time - b.time);

  return points;
}

function normalizePredictionLine(payload: unknown): PredictionPoint[] {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as Record<string, unknown>)?.prediction_line)
      ? ((payload as Record<string, unknown>).prediction_line as unknown[])
      : Array.isArray((payload as Record<string, unknown>)?.predictionLine)
        ? ((payload as Record<string, unknown>).predictionLine as unknown[])
        : [];

  return source
    .map((entry) => {
      if (Array.isArray(entry) && entry.length >= 2) {
        return {
          time: toTimestamp(entry[0]) as PredictionPoint["time"],
          value: asNumber(entry[1]),
        };
      }

      if (typeof entry === "object" && entry) {
        const item = entry as Record<string, unknown>;
        return {
          time: toTimestamp(item.time ?? item.timestamp ?? item.date) as PredictionPoint["time"],
          value: asNumber(item.value ?? item.price ?? item.y),
        };
      }

      return null;
    })
    .filter((value): value is PredictionPoint => Boolean(value))
    .filter((value) => value.value > 0)
    .sort((a, b) => a.time - b.time);
}

function normalizeNews(payload: unknown): NewsItem[] {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as Record<string, unknown>)?.news)
      ? ((payload as Record<string, unknown>).news as unknown[])
      : Array.isArray((payload as Record<string, unknown>)?.data)
        ? ((payload as Record<string, unknown>).data as unknown[])
        : [];

  const normalized: NewsItem[] = [];

  source.forEach((entry) => {
    if (typeof entry !== "object" || !entry) return;

    const item = entry as Record<string, unknown>;
    const title = String(item.title ?? item.headline ?? "").trim();
    if (!title) return;

    const sentimentRaw = String(item.sentiment ?? "neutral").toLowerCase();
    const sentiment: NewsItem["sentiment"] = sentimentRaw.includes("pos")
      ? "positive"
      : sentimentRaw.includes("neg")
        ? "negative"
        : "neutral";

    normalized.push({
      title,
      sentiment,
      source: String(item.source ?? item.publisher ?? "").trim() || undefined,
    });
  });

  return normalized;
}

function formatPrice(value: number | undefined) {
  if (!value || Number.isNaN(value)) return "--";
  return value >= 100 ? value.toFixed(2) : value.toFixed(4);
}

export default function HomePage() {
  const [selectedSymbol, setSelectedSymbol] = useState<WatchSymbol>(symbols[0]);
  const [horizon, setHorizon] = useState(7);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [priceDirectionMap, setPriceDirectionMap] = useState<Record<string, PriceDirection>>({});
  const [candles, setCandles] = useState<CandlePoint[]>([]);
  const [predictionLine, setPredictionLine] = useState<PredictionPoint[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const currentPrice = useMemo(() => {
    const fromTicker = priceMap[selectedSymbol.symbol];
    if (fromTicker && Number.isFinite(fromTicker)) return fromTicker;
    return candles.at(-1)?.close ?? 0;
  }, [candles, priceMap, selectedSymbol.symbol]);

  const selectedDirection = priceDirectionMap[selectedSymbol.symbol] ?? "flat";

  const updatePrice = useCallback((symbol: string, nextPrice: number) => {
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) return;

    setPriceMap((prev) => {
      const previous = prev[symbol];
      const direction: PriceDirection =
        previous === undefined || previous === nextPrice ? "flat" : nextPrice > previous ? "up" : "down";

      setPriceDirectionMap((prevDirections) => ({
        ...prevDirections,
        [symbol]: direction,
      }));

      return {
        ...prev,
        [symbol]: nextPrice,
      };
    });
  }, []);

  const fetchChartAndNews = useCallback(async () => {
    setLoadingChart(true);
    try {
      const [chartResponse, newsResponse] = await Promise.all([
        apiGet<unknown>(`/api/chart?symbol=${selectedSymbol.symbol}`),
        apiGet<unknown>(`/api/news?symbol=${selectedSymbol.symbol}`),
      ]);

      const nextCandles = normalizeCandles(chartResponse);
      setCandles(nextCandles);
      setNews(normalizeNews(newsResponse));
      setPredictionLine([]);
      setForecast(null);

      if (nextCandles.length > 0) {
        const latest = nextCandles[nextCandles.length - 1].close;
        updatePrice(selectedSymbol.symbol, latest);
      }
    } catch {
      toast.error("Unable to load chart or news data.");
    } finally {
      setLoadingChart(false);
    }
  }, [selectedSymbol.symbol, updatePrice]);

  useEffect(() => {
    fetchChartAndNews();
  }, [fetchChartAndNews]);

  useEffect(() => {
    const streamSymbols = symbols
      .filter((item) => item.type === "crypto")
      .map((item) => `${item.symbol.toLowerCase()}@miniTicker`)
      .join("/");

    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamSymbols}`);
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { data?: { s?: string; c?: string } };
        const symbol = payload?.data?.s;
        const close = payload?.data?.c;
        if (!symbol || !close) return;

        updatePrice(symbol, Number(close));
      } catch {
        return;
      }
    };

    return () => ws.close();
  }, [updatePrice]);

  useEffect(() => {
    let cancelled = false;

    const fetchStocks = async () => {
      const stockSymbols = symbols.filter((item) => item.type === "stock").map((item) => item.symbol);
      const responses = await Promise.allSettled(
        stockSymbols.map((symbol) =>
          apiGet<Record<string, unknown>>(`/api/current-price?symbol=${symbol}`).catch(() => null)
        )
      );

      if (cancelled) return;

      const nextPrices: Record<string, number> = {};
      responses.forEach((result, index) => {
        if (result.status !== "fulfilled" || !result.value) return;
        const body = result.value;
        const price = asNumber(
          body.price ?? body.currentPrice ?? body.current_price ?? (body.data as Record<string, unknown>)?.price
        );

        if (price > 0) {
          nextPrices[stockSymbols[index]] = price;
        }
      });

      if (Object.keys(nextPrices).length > 0) {
        Object.entries(nextPrices).forEach(([symbol, latest]) => {
          updatePrice(symbol, latest);
        });
      }
    };

    fetchStocks();
    const id = setInterval(fetchStocks, 3000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [updatePrice]);

  const handleGenerateForecast = async () => {
    setLoadingForecast(true);
    try {
      const response = await apiPost<Record<string, unknown>>("/api/predict", {
        symbol: selectedSymbol.symbol,
        horizon,
      });

      const predictedPrice = asNumber(
        response.predictedPrice ?? response.predicted_price ?? response.forecast_price ?? response.target_price
      );
      const baselinePrice = asNumber(
        response.currentPrice ?? response.current_price ?? response.price ?? currentPrice
      );
      const expectedChangePct =
        asNumber(response.expectedChangePct ?? response.expected_change_pct ?? response.change_pct) ||
        ((predictedPrice - baselinePrice) / (baselinePrice || 1)) * 100;

      const recommendation =
        String(response.recommendation ?? "").trim() || (expectedChangePct >= 0 ? "BUY" : "SELL");
      const confidence = asNumber(response.confidence ?? response.confidence_pct ?? response.probability);

      setForecast({
        currentPrice: baselinePrice,
        predictedPrice,
        expectedChangePct,
        recommendation,
        confidence,
      });

      const normalizedLine = normalizePredictionLine(response);
      if (normalizedLine.length > 1) {
        setPredictionLine(normalizedLine);
      } else {
        const lastTime = candles.at(-1)?.time ?? (Math.floor(Date.now() / 1000) as CandlePoint["time"]);
        const firstValue = baselinePrice || candles.at(-1)?.close || 0;
        const secondValue = predictedPrice || firstValue;
        const oneDay = 24 * 60 * 60;

        setPredictionLine([
          { time: lastTime, value: firstValue },
          { time: (lastTime + horizon * oneDay) as PredictionPoint["time"], value: secondValue },
        ]);
      }

      toast.success("AI forecast generated successfully.");
    } catch {
      toast.error("Forecast generation failed.");
    } finally {
      setLoadingForecast(false);
    }
  };

  const recommendationPositive = (forecast?.recommendation ?? "").toUpperCase().includes("BUY");

  return (
    <div className="mx-auto w-full max-w-[1900px] p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <BrandLogo />
        <Button variant="outline" asChild>
          <Link href="/history">View History</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[270px_minmax(0,1fr)_430px]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BrandLogo compact showText={false} />
              <CardTitle>Watchlist</CardTitle>
            </div>
            <CardDescription>Click any symbol to update data</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[640px] pr-2">
              <div className="space-y-2">
                {symbols.map((item) => {
                  const active = selectedSymbol.symbol === item.symbol;
                  const livePrice = priceMap[item.symbol];
                  const direction = priceDirectionMap[item.symbol] ?? "flat";
                  return (
                    <button
                      key={item.symbol}
                      onClick={() => setSelectedSymbol(item)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors",
                        active
                          ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900"
                      )}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <AssetLogo symbol={item.symbol} size="md" />
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          direction === "up"
                            ? "text-emerald-400"
                            : direction === "down"
                              ? "text-rose-400"
                              : "text-zinc-300"
                        )}
                      >
                        {direction === "up" ? "▲ " : direction === "down" ? "▼ " : ""}
                        {formatPrice(livePrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>{selectedSymbol.label} Chart</CardTitle>
                <CardDescription>Live market + AI projection</CardDescription>
              </div>
              <Badge
                variant={
                  selectedDirection === "up"
                    ? "positive"
                    : selectedDirection === "down"
                      ? "negative"
                      : "neutral"
                }
              >
                {selectedDirection === "up" ? "▲ " : selectedDirection === "down" ? "▼ " : ""}
                Live: {formatPrice(currentPrice)}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {horizons.map((item) => (
                <Button
                  key={item.value}
                  variant={horizon === item.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setHorizon(item.value)}
                >
                  {item.label}
                </Button>
              ))}
              <Separator orientation="vertical" className="mx-1 h-6" />
              <Button variant="positive" size="sm" onClick={handleGenerateForecast} disabled={loadingForecast}>
                {loadingForecast ? "Generating..." : "Generate Forecast"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingChart ? (
              <div className="flex h-[460px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-sm text-zinc-400">
                Loading chart...
              </div>
            ) : (
              <TradingChart candles={candles} prediction={predictionLine} />
            )}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>AI Forecast</CardTitle>
              <CardDescription>Model output for {selectedSymbol.label}</CardDescription>
            </CardHeader>
            <CardContent>
              {forecast ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Current Price</span>
                    <span>{formatPrice(forecast.currentPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Predicted Price</span>
                    <span>{formatPrice(forecast.predictedPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Expected Change</span>
                    <Badge variant={forecast.expectedChangePct >= 0 ? "positive" : "negative"}>
                      {forecast.expectedChangePct.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Recommendation</span>
                    <Badge variant={recommendationPositive ? "positive" : "negative"}>
                      {forecast.recommendation.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Confidence</span>
                    <span>{forecast.confidence.toFixed(1)}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-400">Run a forecast to see the latest AI prediction.</p>
              )}
            </CardContent>
          </Card>

          {/* Financial Flow Sankey */}
          <FinancialSankey symbol={selectedSymbol.symbol} />

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>Latest News</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedDirection === "up"
                        ? "positive"
                        : selectedDirection === "down"
                          ? "negative"
                          : "neutral"
                    }
                    className="text-[10px] tracking-wide"
                  >
                    {selectedDirection === "up" ? "UPTREND" : selectedDirection === "down" ? "DOWNTREND" : "STABLE"}
                  </Badge>
                  <Badge variant="neutral" className="text-[10px] tracking-wide">
                    LIVE FEED
                  </Badge>
                </div>
              </div>
              <CardDescription>Real headlines + sentiment for {selectedSymbol.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[430px] pr-2">
                <div className="space-y-3">
                  {news.length === 0 ? (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
                      No recent headlines available.
                    </div>
                  ) : (
                    news.map((item, index) => (
                      <div
                        key={`${item.title}-${index}`}
                        className={cn(
                          "rounded-lg border bg-zinc-950/60 p-3 transition-colors hover:bg-zinc-900/70",
                          item.sentiment === "positive"
                            ? "border-emerald-500/25"
                            : item.sentiment === "negative"
                              ? "border-rose-500/25"
                              : "border-zinc-800"
                        )}
                      >
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <Badge
                            variant={
                              item.sentiment === "positive"
                                ? "positive"
                                : item.sentiment === "negative"
                                  ? "negative"
                                  : "neutral"
                            }
                            className="text-[10px] tracking-wide"
                          >
                            {item.sentiment.toUpperCase()}
                          </Badge>
                          {item.source ? (
                            <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] uppercase tracking-wide text-zinc-400">
                              {item.source}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm leading-5 text-zinc-100">{item.title}</p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
