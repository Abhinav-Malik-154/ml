"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssetLogo } from "@/app/components/AssetLogo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiDelete, apiGet } from "@/lib/api";

type PredictionRow = {
  id: string;
  date: string;
  symbol: string;
  current: number;
  predicted: number;
  change: number;
  horizon: string;
  confidence: number;
  recommendation: string;
};

function asNumber(input: unknown): number {
  const n = Number(input);
  return Number.isFinite(n) ? n : 0;
}

function asDate(input: unknown): string {
  if (!input) return new Date().toLocaleString();
  const date = new Date(String(input));
  if (Number.isNaN(date.getTime())) return new Date().toLocaleString();
  return date.toLocaleString();
}

function normalizeRows(payload: unknown): PredictionRow[] {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as Record<string, unknown>)?.predictions)
      ? ((payload as Record<string, unknown>).predictions as unknown[])
      : Array.isArray((payload as Record<string, unknown>)?.data)
        ? ((payload as Record<string, unknown>).data as unknown[])
        : [];

  return source
    .map((entry, index) => {
      if (typeof entry !== "object" || !entry) return null;
      const item = entry as Record<string, unknown>;
      const current = asNumber(item.current ?? item.current_price ?? item.currentPrice ?? item.price);
      const predicted = asNumber(item.predicted ?? item.predicted_price ?? item.predictedPrice);
      const change =
        asNumber(item.change ?? item.change_pct ?? item.expectedChangePct) ||
        ((predicted - current) / (current || 1)) * 100;

      return {
        id: String(item.id ?? item._id ?? index),
        date: asDate(item.date ?? item.created_at ?? item.createdAt ?? item.timestamp),
        symbol: String(item.symbol ?? "--"),
        current,
        predicted,
        change,
        horizon: String(item.horizon ?? item.horizon_days ?? item.horizonDays ?? "--"),
        confidence: asNumber(item.confidence ?? item.confidence_pct ?? item.probability),
        recommendation: String(item.recommendation ?? "HOLD"),
      };
    })
    .filter((item): item is PredictionRow => Boolean(item));
}

function formatPrice(value: number) {
  if (!value || Number.isNaN(value)) return "--";
  return value >= 100 ? value.toFixed(2) : value.toFixed(4);
}

export default function HistoryPage() {
  const [rows, setRows] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPredictions = useCallback(async () => {
    try {
      const response = await apiGet<unknown>("/api/predictions");
      setRows(normalizeRows(response));
    } catch {
      toast.error("Failed to fetch prediction history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPredictions();
    const id = setInterval(loadPredictions, 10000);
    return () => clearInterval(id);
  }, [loadPredictions]);

  const handleClearAll = async () => {
    try {
      await apiDelete("/api/predictions");
      setRows([]);
      toast.success("Prediction history cleared.");
    } catch {
      toast.error("Could not clear prediction history.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Prediction History</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
          <Button variant="negative" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Forecasts</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Predicted</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Horizon</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-zinc-400">
                      Loading predictions...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-zinc-400">
                      No predictions saved yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AssetLogo symbol={row.symbol} size="md" />
                          <span>{row.symbol}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(row.current)}</TableCell>
                      <TableCell>{formatPrice(row.predicted)}</TableCell>
                      <TableCell>
                        <Badge variant={row.change >= 0 ? "positive" : "negative"}>
                          {row.change.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{row.horizon}</TableCell>
                      <TableCell>{row.confidence.toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.recommendation.toUpperCase().includes("BUY") ? "positive" : "negative"}
                        >
                          {row.recommendation.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
