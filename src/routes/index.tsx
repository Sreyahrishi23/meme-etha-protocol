import { createFileRoute, Link } from "@tanstack/react-router";
import { Atmosphere } from "@/components/lab/atmosphere";
import { LabFooter, LabHeader } from "@/components/lab/chrome";
import { Annotation } from "@/components/lab/annotation";
import { CLASS_COUNT } from "@/lib/classifier";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meme Etha — Facial Expression Classification System" },
      {
        name: "description",
        content:
          "Meme Etha is a real-time facial expression classification and meme response system. Calibrate a baseline, then receive a clinically selected meme.",
      },
      { property: "og:title", content: "Meme Etha — Facial Expression Classification System" },
      {
        property: "og:description",
        content:
          "Real-time expression classification across 14 reaction classes, calibrated to the subject. Serious instrument. Absurd output.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SPECS = [
  { label: "Acquisition", value: "REAL-TIME", note: "30 fps · local inference" },
  { label: "Baseline", value: "CALIBRATED TO USER", note: "9 s establishing scan" },
  { label: "Taxonomy", value: `${CLASS_COUNT} REACTION CLASSES`, note: "RC-01 → RC-14" },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Atmosphere />
      <LabHeader stage="Cover sheet" />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 sm:px-10">
        <div className="grid gap-16 pt-16 pb-24 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:pt-28">
          <div>
            <p className="label-tech">Specimen report · file ME-14</p>
            <h1 className="mt-6 text-6xl leading-[0.92] font-semibold tracking-tight sm:text-7xl lg:text-8xl">
              Meme
              <br />
              Etha
            </h1>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              Facial Expression Classification &amp; Meme Response System. The instrument observes
              the subject, establishes a neutral baseline, and returns the statistically indicated
              meme.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link
                to="/calibrate"
                className="iris-edge rounded-sm bg-secondary px-7 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-colors hover:bg-accent"
              >
                Begin examination
              </Link>
              <span className="label-tech max-w-[16rem]">
                Requires camera access · nothing leaves this device
              </span>
            </div>
          </div>

          <div className="relative">
            <div
              className="iris-edge relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-card"
              style={{ boxShadow: "var(--shadow-specimen)" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, color-mix(in oklab, var(--iris-violet) 30%, transparent), transparent 62%)",
                }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <div
                  className="size-40 rounded-full border"
                  style={{ borderColor: "var(--hairline)" }}
                />
                <div
                  className="absolute size-64 rounded-full border"
                  style={{ borderColor: "color-mix(in oklab, var(--iris-teal) 30%, transparent)" }}
                />
              </div>
              <span className="label-tech absolute top-4 left-4">Fig. 01 — subject frame</span>
              <span className="readout absolute right-4 bottom-4 text-[0.65rem] text-muted-foreground">
                σ 0.0412 · λ 549nm
              </span>
            </div>
          </div>
        </div>

        <div className="hairline h-px w-full" />

        <section className="grid gap-10 py-14 sm:grid-cols-3">
          {SPECS.map((s) => (
            <div key={s.label}>
              <Annotation label={s.label} value={s.value} lineLength="3rem" />
              <p className="readout mt-3 pl-0 text-[0.7rem] text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </section>
      </main>

      <LabFooter note="Meme Etha · instrument idle" />
    </div>
  );
}
