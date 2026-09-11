import memeShock from "@/assets/meme-shock.jpg.asset.json";
import memeSmug from "@/assets/meme-smug.jpg.asset.json";
import memeGrin from "@/assets/meme-grin.jpg.asset.json";
import memePolite from "@/assets/meme-polite.jpg.asset.json";
import memeStare from "@/assets/meme-stare.jpg.asset.json";

export type ReactionClass = {
  id: string;
  name: string;
  code: string;
  meme: string;
  caption: string;
};

export const REACTION_CLASSES: ReactionClass[] = [
  {
    id: "shock",
    name: "Ocular Startle",
    code: "RC-02",
    meme: memeShock.url,
    caption: "Subject exhibits catastrophic surprise",
  },
  {
    id: "smug",
    name: "Elevated Self-Regard",
    code: "RC-07",
    meme: memeSmug.url,
    caption: "Subject believes they have won",
  },
  {
    id: "grin",
    name: "Maximal Dentition",
    code: "RC-04",
    meme: memeGrin.url,
    caption: "Subject is delighted beyond protocol",
  },
  {
    id: "polite",
    name: "Courtesy Micro-Smile",
    code: "RC-09",
    meme: memePolite.url,
    caption: "Subject is being polite about it",
  },
  {
    id: "stare",
    name: "Proximity Fixation",
    code: "RC-11",
    meme: memeStare.url,
    caption: "Subject has moved too close to the lens",
  },
];

export const CLASS_COUNT = 14;

/** Rolling frame statistics used to derive a (deliberately absurd) classification. */
export type FrameStats = {
  luma: number;
  motion: number;
  contrast: number;
};

export function classify(stats: FrameStats, baseline: FrameStats) {
  const motionDelta = stats.motion - baseline.motion;
  const lumaDelta = stats.luma - baseline.luma;
  const contrastDelta = stats.contrast - baseline.contrast;

  const scores = [
    // shock — sudden motion + light shift
    0.3 + motionDelta * 5 + Math.abs(lumaDelta) * 2.2,
    // smug — rising contrast, slight brightening
    0.3 + contrastDelta * 4 + lumaDelta * 1.6,
    // grin — bright + high motion energy
    0.28 + lumaDelta * 3.2 + motionDelta * 2.4,
    // polite — near-baseline everything
    0.4 - Math.abs(motionDelta) * 2.6 - Math.abs(lumaDelta) * 2,
    // stare — face fills frame: low motion, falling contrast
    0.3 - contrastDelta * 3.6 - motionDelta * 1.8,
  ];

  let best = 0;
  for (let i = 1; i < scores.length; i++) if (scores[i]! > scores[best]!) best = i;

  const total = scores.reduce((a, b) => a + Math.max(b, 0.01), 0);
  const confidence = Math.min(0.985, Math.max(0.31, Math.max(scores[best]!, 0.01) / total));

  return { reaction: REACTION_CLASSES[best]!, confidence };
}

export function readFrameStats(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  previous: Uint8ClampedArray | null,
): { stats: FrameStats; frame: Uint8ClampedArray } {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.drawImage(video, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  let sum = 0;
  let sumSq = 0;
  let motion = 0;
  let n = 0;

  for (let i = 0; i < data.length; i += 4) {
    const l = (data[i]! * 0.299 + data[i + 1]! * 0.587 + data[i + 2]! * 0.114) / 255;
    sum += l;
    sumSq += l * l;
    if (previous) {
      const p =
        (previous[i]! * 0.299 + previous[i + 1]! * 0.587 + previous[i + 2]! * 0.114) / 255;
      motion += Math.abs(l - p);
    }
    n++;
  }

  const luma = sum / n;
  const contrast = Math.sqrt(Math.max(sumSq / n - luma * luma, 0));
  return {
    stats: { luma, contrast, motion: previous ? motion / n : 0 },
    frame: data,
  };
}
