import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker | null = null;
let loading: Promise<FaceLandmarker> | null = null;

export async function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (faceLandmarker) return faceLandmarker;
  if (loading) return loading;

  loading = (async () => {
    const fileset = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );
    const make = (delegate: "GPU" | "CPU") =>
      FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate,
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });

    // Some machines/browsers have no usable WebGL — fall back to CPU rather than fail.
    const landmarker = await make("GPU").catch(() => make("CPU"));
    faceLandmarker = landmarker;
    return landmarker;
  })();

  return loading;
}

export type BlendshapeFrame = Record<string, number>;

/** Runs detection on the current video frame, returns a name->score map. */
export function detectFrame(
  landmarker: FaceLandmarker,
  video: HTMLVideoElement,
  timestampMs: number
): BlendshapeFrame | null {
  try {
    const result = landmarker.detectForVideo(video, timestampMs);
    const shapes = result.faceBlendshapes?.[0]?.categories;
    if (!shapes) return null;

    const frame: BlendshapeFrame = {};
    for (const s of shapes) frame[s.categoryName] = s.score;
    return frame;
  } catch {
    // A single bad frame (e.g. video not ready yet) must never crash the loop.
    return null;
  }
}
