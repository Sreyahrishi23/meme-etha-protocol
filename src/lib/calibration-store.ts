import type { BlendshapeFrame } from "@/lib/detector";

export type Baseline = Record<string, { mean: number; std: number }>;

let baseline: Baseline | null = null;

export function setBaseline(b: Baseline) {
  baseline = b;
}

export function getBaseline(): Baseline | null {
  return baseline;
}

/** Accumulates raw samples during calibration, then call finalize() once done. */
export class BaselineAccumulator {
  private samples: BlendshapeFrame[] = [];

  add(frame: BlendshapeFrame) {
    this.samples.push(frame);
  }

  finalize(): Baseline {
    const result: Baseline = {};
    const keys = new Set<string>();
    this.samples.forEach((s) => Object.keys(s).forEach((k) => keys.add(k)));

    for (const key of keys) {
      const values = this.samples.map((s) => s[key] ?? 0);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance =
        values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
      result[key] = { mean, std: Math.sqrt(variance) || 0.01 }; // avoid divide-by-zero
    }
    return result;
  }
}
