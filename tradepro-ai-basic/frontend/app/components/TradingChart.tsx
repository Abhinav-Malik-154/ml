"use client";

import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
  LineSeries,
  type LineData,
  type UTCTimestamp,
} from "lightweight-charts";

export type CandlePoint = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type PredictionPoint = {
  time: UTCTimestamp;
  value: number;
};

type TradingChartProps = {
  candles: CandlePoint[];
  prediction: PredictionPoint[];
};

export function TradingChart({ candles, prediction }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const predictionSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#09090b" },
        textColor: "#a1a1aa",
      },
      rightPriceScale: {
        borderColor: "#27272a",
      },
      timeScale: {
        borderColor: "#27272a",
      },
      grid: {
        vertLines: { color: "#18181b" },
        horzLines: { color: "#18181b" },
      },
      crosshair: {
        vertLine: { color: "#3f3f46" },
        horzLine: { color: "#3f3f46" },
      },
      autoSize: true,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#f43f5e",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
      priceLineVisible: true,
      priceLineColor: "#71717a",
    });

    const predictionSeries = chart.addSeries(LineSeries, {
      color: "#60a5fa",
      lineWidth: 2,
      lineStyle: 2,
      priceLineVisible: false,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    predictionSeriesRef.current = predictionSeries;

    return () => {
      chartRef.current = null;
      candleSeriesRef.current = null;
      predictionSeriesRef.current = null;
      chart.remove();
    };
  }, []);

  useEffect(() => {
    candleSeriesRef.current?.setData(candles as CandlestickData[]);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  useEffect(() => {
    predictionSeriesRef.current?.setData(prediction as LineData[]);
  }, [prediction]);

  return <div ref={containerRef} className="h-[460px] w-full" />;
}
