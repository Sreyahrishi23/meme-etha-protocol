import memeShock from "@/assets/meme-shock.jpg";
import memeSmug from "@/assets/meme-smug.jpg";
import memeDeadpan from "@/assets/meme-deadpan.jpg";

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
    meme: memeShock,
    caption: "Subject exhibits catastrophic surprise",
  },
  {
    id: "smug",
    name: "Elevated Self-Regard",
    code: "RC-07",
    meme: memeSmug,
    caption: "Subject believes they have won",
  },
  {
    id: "deadpan",
    name: "Affect Flattening",
    code: "RC-11",
    meme: memeDeadpan,
    caption: "Subject has left the building",
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
    0.3 + motionDelta * 5 + Math.abs(lumaDelta) * 2.2,
    0.3 + contrastDelta * 4 + lumaDelta * 1.6,
    0.42 - motionDelta * 3.4 - Math.abs(contrastDelta) * 2,
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
