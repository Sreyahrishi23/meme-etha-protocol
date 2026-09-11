import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Side = "left" | "right";

/**
 * Thin annotation line + uppercase technical label, like a specimen diagram.
 */
export function Annotation({
  side = "left",
  label,
  value,
  className,
  lineLength = "5rem",
}: {
  side?: Side;
  label: string;
  value?: ReactNode;
  className?: string;
  lineLength?: string;
}) {
  const line = (
    <span className="flex items-center" aria-hidden="true">
      {side === "left" ? null : <Dot />}
      <span
        className="h-px"
        style={{
          width: lineLength,
          background:
            side === "left"
              ? "linear-gradient(to right, var(--hairline), transparent)"
              : "linear-gradient(to left, var(--hairline), transparent)",
        }}
      />
      {side === "left" ? <Dot /> : null}
    </span>
  );

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        side === "right" && "flex-row-reverse text-right",
        className,
      )}
    >
      <div className={cn("flex flex-col", side === "right" && "items-end")}>
        <span className="label-tech">{label}</span>
        {value !== undefined && (
          <span className="readout text-sm text-foreground">{value}</span>
        )}
      </div>
      {line}
    </div>
  );
}

function Dot() {
  return (
    <span
      className="block size-1 rounded-full"
      style={{ background: "var(--iris-teal)", boxShadow: "0 0 8px var(--iris-teal)" }}
    />
  );
}
