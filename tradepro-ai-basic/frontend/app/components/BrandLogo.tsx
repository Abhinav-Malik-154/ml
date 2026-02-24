import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  showText?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, showText = true, className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 font-semibold tracking-wide",
          compact ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs"
        )}
      >
        <span className="text-emerald-400">T</span>
        <span className="text-rose-400">P</span>
      </div>
      {showText ? (
        <div className="leading-tight">
          <p className={cn("font-semibold text-zinc-100", compact ? "text-xs" : "text-sm")}>TradePro AI</p>
          {!compact ? <p className="text-[10px] text-zinc-400">Institutional Trading Desk</p> : null}
        </div>
      ) : null}
    </div>
  );
}
