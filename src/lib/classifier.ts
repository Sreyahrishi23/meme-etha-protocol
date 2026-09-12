import memeShock from "@/assets/meme-shock.jpg.asset.json";
import memeSmug from "@/assets/meme-smug.jpg.asset.json";
import memeGrin from "@/assets/meme-grin.jpg.asset.json";
import memePolite from "@/assets/meme-polite.jpg.asset.json";
import memeStare from "@/assets/meme-stare.jpg.asset.json";
import type { BlendshapeFrame } from "@/lib/detector";
import type { Baseline } from "@/lib/calibration-store";

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

function zScore(frame: BlendshapeFrame, baseline: Baseline, key: string): number {
  const b = baseline[key];
  if (!b) return 0;
  return ((frame[key] ?? 0) - b.mean) / b.std;
}

export function classify(frame: BlendshapeFrame, baseline: Baseline) {
  const jawOpen = zScore(frame, baseline, "jawOpen");
  const browUp = zScore(frame, baseline, "browInnerUp");
  const smileL = zScore(frame, baseline, "mouthSmileLeft");
  const smileR = zScore(frame, baseline, "mouthSmileRight");
  const squintL = zScore(frame, baseline, "eyeSquintLeft");
  const squintR = zScore(frame, baseline, "eyeSquintRight");
  const cheekPuff = zScore(frame, baseline, "cheekPuff");
  const mouthPress = zScore(frame, baseline, "mouthPressLeft");

  const scores = [
    jawOpen * 1.4 + Math.abs(browUp) * 0.6,
    mouthPress * 1.2 + browUp * 0.8 - jawOpen * 0.5,
    (smileL + smileR) * 1.1 + cheekPuff * 0.4,
    0.5 - Math.abs(smileL - smileR) * 0.6 - jawOpen * 0.3,
    (squintL + squintR) * 1.3 - jawOpen * 0.4,
  ];

  let best = 0;
  for (let i = 1; i < scores.length; i++) if (scores[i]! > scores[best]!) best = i;

  const total = scores.reduce((a, b) => a + Math.max(b, 0.01), 0);
  const confidence = Math.min(0.985, Math.max(0.05, Math.max(scores[best]!, 0.01) / total));

  return { reaction: REACTION_CLASSES[best]!, confidence };
}
