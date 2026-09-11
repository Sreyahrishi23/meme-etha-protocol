import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Atmosphere } from "@/components/lab/atmosphere";
import { LabFooter, LabHeader } from "@/components/lab/chrome";
import { Annotation } from "@/components/lab/annotation";
import {
  CLASS_COUNT,
  REACTION_CLASSES,
  classify,
  readFrameStats,
  type FrameStats,
  type ReactionClass,
} from "@/lib/classifier";

export const Route = createFileRoute("/detect")({
  head: () => ({
    meta: [
      { title: "Live Classification — Meme Etha" },
      {
        name: "description",
        content:
          "Live facial expression classification. The specimen feed is annotated in real time and the indicated meme is issued on detection.",
      },
      { property: "og:title", content: "Live Classification — Meme Etha" },
      {
        property: "og:description",
        content: "Real-time reaction class readout with instrument-grade annotations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Detect;
});

function Detect() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [reaction, setReaction] = useState<ReactionClass>(REACTION_CLASSES[0]!);
  const [confidence, setConfidence] = useState(0.42);
  const [stats, setStats] = useState<FrameStats>({ luma: 0, motion: 0, contrast: 0 });
  const [memeVisible, setMemeVisible] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let prev: Uint8ClampedArray | null = null;
    let baseline: FrameStats | null = null;
    let smoothed = 0.4;
    let lastId = REACTION_CLASSES[0]!.id;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 48;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user", width: 1280 }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          void videoRef.current.play();
        }
      })
      .catch(() => setError("Camera unavailable — the instrument cannot observe the specimen."));

    const loop = () => {
      const video = videoRef.current;
      if (ctx && video && video.readyState >= 2) {
        const { stats: s, frame } = readFrameStats(ctx, video, prev);
        prev = frame;
        if (!baseline) baseline = s;
        baseline = {
          luma: baseline.luma * 0.99 + s.luma * 0.01,
          motion: baseline.motion * 0.985 + s.motion * 0.015,
          contrast: baseline.contrast * 0.99 + s.contrast * 0.01,
        };
        const { reaction: r, confidence: c } = classify(s, baseline);
        smoothed = smoothed * 0.88 + c * 0.12;
        setStats(s);
        setConfidence(smoothed);
        if (r.id !== lastId && smoothed > 0.45) {
          lastId = r.id;
          setReaction(r);
        }
        setMemeVisible(smoothed > 0.55);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const pct = (confidence * 100).toFixed(1);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Atmosphere />
      <LabHeader stage="Phase 02 · classification" />

      <main className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_18rem] lg:items-start">
        <section>
          <div
            className="iris-edge relative aspect-video w-full overflow-hidden rounded-sm bg-card"
            style={{ boxShadow: "var(--shadow-specimen)" }}
          >
            {error ? (
              <div className="grid h-full place-items-center px-10 text-center text-sm text-muted-foreground">
                {error}
              </div>
            ) : (
              <video
                ref={videoRef}
                muted
                playsInline
                className="size-full scale-x-[-1] object-cover"
              />
            )}

            {/* specimen reticle */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-[16%] left-1/2 h-[62%] w-[34%] -translate-x-1/2 border border-[color-mix(in_oklab,var(--iris-teal)_45%,transparent)]">
                <Corner className="-top-px -left-px" />
                <Corner className="-top-px -right-px rotate-90" />
                <Corner className="-right-px -bottom-px rotate-180" />
                <Corner className="-bottom-px -left-px -rotate-90" />
              </div>

              <div className="absolute top-[22%] left-[6%] hidden sm:block">
                <Annotation label="Pose class" value={reaction.name} lineLength="6rem" />
              </div>
              <div className="absolute top-[52%] right-[5%] hidden sm:block">
                <Annotation
                  side="right"
                  label="Confidence"
                  value={`${pct}%`}
                  lineLength="6rem"
                />
              </div>
              <div className="absolute bottom-[12%] left-[8%] hidden sm:block">
                <Annotation
                  label="Micro-motion"
                  value={stats.motion.toFixed(4)}
                  lineLength="4.5rem"
                />
              </div>

              <span className="label-tech absolute top-4 left-4">Fig. 02 — live specimen</span>
              <span className="readout absolute right-4 bottom-4 text-[0.65rem] text-muted-foreground">
                L {stats.luma.toFixed(3)} · C {stats.contrast.toFixed(3)}
              </span>
            </div>

            {/* meme response */}
            <div
              className={`pointer-events-none absolute right-5 bottom-5 w-40 transition-all duration-500 sm:w-56 ${
                memeVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
              }`}
            >
              <div
                className="overflow-hidden rounded-sm"
                style={{
                  boxShadow:
                    "0 0 0 1px color-mix(in oklab, var(--iris-pink) 60%, transparent), 0 30px 70px -25px color-mix(in oklab, var(--iris-pink) 70%, transparent)",
                }}
              >
                <img
                  src={reaction.meme}
                  alt={`Meme response for ${reaction.name}`}
                  width={816}
                  height={816}
                  loading="lazy"
                  className="block w-full"
                />
              </div>
              <p className="label-tech mt-2 text-right">
                {reaction.code} issued · {reaction.caption}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="label-tech">
              Taxonomy RC-01 → RC-{CLASS_COUNT} · {REACTION_CLASSES.length} active heads
            </span>
            <Link
              to="/calibrate"
              className="label-tech rounded-sm border border-border px-4 py-2 transition-colors hover:bg-accent"
            >
              Recalibrate baseline
            </Link>
          </div>
        </section>

        <aside className="flex flex-col gap-8">
          <div>
            <p className="label-tech">Current classification</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{reaction.name}</p>
            <p className="readout mt-1 text-xs text-muted-foreground">
              {reaction.code} · confidence {pct}%
            </p>
          </div>

          <div className="hairline h-px w-full" />

          <div className="flex flex-col gap-4">
            {REACTION_CLASSES.map((c) => {
              const active = c.id === reaction.id;
              const v = active ? confidence : Math.max(0.04, (1 - confidence) / 2);
              return (
                <div key={c.id}>
                  <div className="flex items-baseline justify-between">
                    <span className="label-tech" style={active ? { color: "var(--iris-teal)" } : undefined}>
                      {c.code} {c.name}
                    </span>
                    <span className="readout text-[0.7rem] text-muted-foreground">
                      {(v * 100).toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-2 h-px w-full bg-border">
                    <div
                      className="h-px transition-[width] duration-300"
                      style={{
                        width: `${v * 100}%`,
                        background: active ? "var(--gradient-iris)" : "var(--hairline)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hairline h-px w-full" />

          <p className="text-xs leading-relaxed text-muted-foreground">
            Classification runs entirely on-device. No frame is transmitted, stored, or shown to
            anyone with the authority to judge you.
          </p>
        </aside>
      </main>

      <LabFooter note="Meme Etha · live classification" />
    </div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      className={`absolute size-3 border-t border-l ${className ?? ""}`}
      style={{ borderColor: "var(--iris-teal)" }}
    />
  );
}
