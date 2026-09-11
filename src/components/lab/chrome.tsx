import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function LabHeader({ stage }: { stage: string }) {
  const clock = useClock();
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link to="/" className="flex items-baseline gap-3">
        <span className="text-sm font-semibold tracking-[0.28em] uppercase">Meme Etha</span>
        <span className="label-tech hidden sm:inline">ME-14 / v2.4</span>
      </Link>
      <div className="flex items-center gap-6">
        <span className="label-tech hidden sm:inline">{stage}</span>
        <span className="readout text-[0.7rem] text-muted-foreground">{clock}</span>
        <span className="flex items-center gap-2">
          <span
            className="pulse-dot block size-1.5 rounded-full"
            style={{ background: "var(--iris-gold)" }}
          />
          <span className="label-tech">LIVE</span>
        </span>
      </div>
    </header>
  );
}

export function LabFooter({ note }: { note: string }) {
  return (
    <footer className="relative z-10 px-6 pt-10 pb-8 sm:px-10">
      <div className="hairline h-px w-full" />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="label-tech">{note}</span>
        <span className="label-tech">Specimen data retained locally · no upload</span>
      </div>
    </footer>
  );
}

export function useClock() {
  const [t, setT] = useState("--:--:--.---");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setT(
        `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}:${String(
          d.getUTCSeconds(),
        ).padStart(2, "0")}.${String(d.getUTCMilliseconds()).padStart(3, "0")}Z`,
      );
    };
    tick();
    const id = window.setInterval(tick, 70);
    return () => window.clearInterval(id);
  }, []);
  return t;
}
