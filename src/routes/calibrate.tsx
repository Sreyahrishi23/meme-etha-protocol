import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Atmosphere } from "@/components/lab/atmosphere";
import { LabFooter, LabHeader } from "@/components/lab/chrome";
import { Annotation } from "@/components/lab/annotation";

export const Route = createFileRoute("/calibrate")({
  head: () => ({
    meta: [
      { title: "Calibration Scan — Meme Etha" },
      {
        name: "description",
        content:
          "Establish a neutral facial baseline for Meme Etha before live expression classification begins.",
      },
      { property: "og:title", content: "Calibration Scan — Meme Etha" },
      {
        property: "og:description",
        content: "Hold still while the instrument establishes your neutral baseline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Calibrate,
});

const DURATION = 9000;

function Calibrate() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [readout, setReadout] = useState({ sigma: 0, gain: 0, drift: 0 });

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    const start = performance.now();

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          void videoRef.current.play();
        }
      })
      .catch(() => setError("Camera unavailable — grant access to establish a baseline."));

    const loop = () => {
      const p = Math.min(1, (performance.now() - start) / DURATION);
      setProgress(p);
      setReadout({
        sigma: 0.031 + Math.sin(performance.now() / 340) * 0.006 * (1 - p),
        gain: 1.42 + Math.cos(performance.now() / 510) * 0.09 * (1 - p),
        drift: (1 - p) * 0.83 + Math.sin(performance.now() / 200) * 0.02,
      });
      if (p < 1) raf = requestAnimationFrame(loop);
      else
        window.setTimeout(() => {
          void navigate({ to: "/detect" });
        }, 700);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [navigate]);

  const pct = Math.round(progress * 100);
  const R = 132;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Atmosphere />
      <LabHeader stage="Phase 01 · baseline" />

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-14 sm:px-10">
        <p className="label-tech">Diagnostic scan in progress</p>
        <h1 className="mt-5 text-center text-2xl font-semibold tracking-[0.18em] uppercase sm:text-3xl">
          Hold still — establishing baseline
        </h1>
        <p className="mt-4 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          Maintain a neutral expression. The instrument is sampling your resting facial geometry so
          later deviations can be measured against it.
        </p>

        <div className="relative mt-16 grid place-items-center">
          <svg viewBox="0 0 320 320" className="size-[19rem] -rotate-90 sm:size-[21rem]">
            <circle cx="160" cy="160" r={R} fill="none" stroke="var(--border)" strokeWidth="1" />
            {Array.from({ length: 72 }).map((_, i) => {
              const a = (i / 72) * Math.PI * 2;
              const long = i % 6 === 0;
              const r1 = R + 8;
              const r2 = R + (long ? 20 : 14);
              return (
                <line
                  key={i}
                  x1={(160 + Math.cos(a) * r1).toFixed(2)}
                  y1={(160 + Math.sin(a) * r1).toFixed(2)}
                  x2={(160 + Math.cos(a) * r2).toFixed(2)}
                  y2={(160 + Math.sin(a) * r2).toFixed(2)}
                  stroke="var(--hairline)"
                  strokeWidth={long ? 1.2 : 0.6}
                  opacity={i / 72 <= progress ? 1 : 0.3}
                />
              );
            })}
            <circle
              cx="160"
              cy="160"
              r={R}
              fill="none"
              stroke="url(#iris)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
            />
            <defs>
              <linearGradient id="iris" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--iris-violet)" />
                <stop offset="45%" stopColor="var(--iris-teal)" />
                <stop offset="75%" stopColor="var(--iris-gold)" />
                <stop offset="100%" stopColor="var(--iris-pink)" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute grid size-52 place-items-center overflow-hidden rounded-full border border-border bg-card sm:size-56">
            {error ? (
              <p className="px-8 text-center text-xs text-muted-foreground">{error}</p>
            ) : (
              <video
                ref={videoRef}
                muted
                playsInline
                className="size-full scale-x-[-1] object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 grid place-items-end justify-center pb-6">
              <span className="readout text-3xl font-medium">{pct}%</span>
            </div>
          </div>
        </div>

        <div className="mt-16 grid w-full max-w-3xl gap-8 sm:grid-cols-3">
          <Annotation label="Sigma" value={readout.sigma.toFixed(4)} lineLength="2.5rem" />
          <Annotation label="Sensor gain" value={`${readout.gain.toFixed(2)}×`} lineLength="2.5rem" />
          <Annotation
            label="Residual drift"
            value={readout.drift.toFixed(3)}
            lineLength="2.5rem"
          />
        </div>

        <p className="readout mt-10 text-[0.7rem] text-muted-foreground">
          {progress < 1
            ? `SAMPLING FRAME ${String(Math.round(progress * 270)).padStart(3, "0")} / 270`
            : "BASELINE LOCKED — ADVANCING TO CLASSIFICATION"}
        </p>
      </main>

      <LabFooter note="Meme Etha · calibration" />
    </div>
  );
}
