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
    const landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1,
    });
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
  const result = landmarker.detectForVideo(video, timestampMs);
  const shapes = result.faceBlendshapes?.[0]?.categories;
  if (!shapes) return null;

  const frame: BlendshapeFrame = {};
  for (const s of shapes) frame[s.categoryName] = s.score;
  return frame;
}
