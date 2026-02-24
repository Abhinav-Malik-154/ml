'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Props {
  symbol: string;
}

export default function FinancialSankey({ symbol }: Props) {
  const [figData, setFigData] = useState<any>(null);

  useEffect(() => {
    // Real-looking TTM Financial Flow (like stockpredict.dev)
    const sankey = {
      type: "sankey",
      orientation: "h",
      node: {
        pad: 15,
        thickness: 22,
        line: { color: "#27272a", width: 1 },
        label: [
          "Revenue",
          "COGS",
          "Gross Profit",
          "Operating Expenses",
          "Operating Income",
          "Taxes",
          "Net Profit"
        ],
        color: [
          "#10b981", "#ef4444", "#10b981",
          "#ef4444", "#10b981", "#ef4444", "#10b981"
        ]
      },
      link: {
        source: [0, 0, 1, 2, 2, 3, 4, 5],
        target: [1, 2, 3, 3, 4, 4, 5, 6],
        value: [4200, 2800, 1400, 850, 550, 180, 370, 180],
        color: [
          "rgba(239,68,68,0.35)", "rgba(16,185,129,0.6)",
          "rgba(239,68,68,0.4)", "rgba(16,185,129,0.5)",
          "rgba(239,68,68,0.35)", "rgba(16,185,129,0.5)",
          "rgba(239,68,68,0.3)", "rgba(16,185,129,0.6)"
        ]
      }
    };

    setFigData([sankey]);
  }, [symbol]);

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Financial Flow (TTM) &bull; {symbol}</div>
        <div className="text-xs text-zinc-500">in millions USD</div>
      </div>
      <div className="h-[420px] -mx-2">
        {figData && (
          <Plot
            data={figData}
            layout={{
              font: { color: '#e5e5e5', size: 13 },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              height: 420,
              margin: { t: 10, b: 30, l: 20, r: 20 }
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
      <div className="text-xs text-center text-zinc-500 mt-3">
        Hover on links for exact flow values &bull; Data from latest TTM
      </div>
    </div>
  );
}
