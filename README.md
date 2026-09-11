# Meme Etha Protocol

Design "Meme Etha" as a dark, cinematic, lab-instrument-style web app — like a 

scientific specimen readout crossed with a moody film-grain photograph. The tone 

should feel like serious research equipment, even though the actual function 

(detecting your face and throwing a meme at you) is absurd. That contrast is 

intentional.

## Visual direction

- Near-black background (#0A0A0C or similar) with a subtle fine-grain/noise texture 

  overlay across the entire canvas — not flat black, it should feel like grainy film 

  or an old CRT scan

- Iridescent color bleeds used sparingly as accents: soft purples, teals, warm gold, 

  and pink light — like light passing through oil or a holographic surface. Use these 

  as glows, gradient edges on cards, or scattered soft "bokeh" light particles in the 

  background rather than solid color blocks

- Thin, delicate white/light-grey annotation lines connecting UI elements to small 

  uppercase technical labels (like a scientific diagram pointing out parts of a 

  specimen) — use this pattern for things like: labeling the detected pose, showing 

  confidence/calibration values, annotating parts of the camera feed

- Typography: a clean, slightly technical sans-serif for body text (like a lab report), 

  paired with small monospace text for data/readouts (confidence %, sigma values, 

  timestamps) — mimics scientific instrumentation

- Generous negative space — the dark background should breathe, with content 

  (camera feed, key readouts) treated like specimens under examination, not packed 

  into dense card grids

- Subtle scan-line or vignette effects are welcome if they don't hurt readability

## Where to apply this

1. **Landing page**: Treat "Meme Etha" like the cover page of a research specimen 

   report — the app name in bold clean type, a small technical-sounding subtitle 

   (e.g. "Facial Expression Classification & Meme Response System"), thin annotation 

   lines pointing to a few "spec" callouts (e.g. "REAL-TIME", "CALIBRATED TO USER", 

   "14 REACTION CLASSES"). Background should have the grainy dark bokeh treatment.

2. **Calibration screen**: Frame this like a diagnostic scan — a circular progress 

   ring with fine tick marks (like a lab dial), small live-updating readout text 

   (mimicking sensor data), and instructional copy that reads clinically serious 

   ("HOLD STILL — ESTABLISHING BASELINE").

3. **Live detection screen**: The camera feed becomes the "specimen" being examined — 

   thin annotation lines can point from the detected face/hands to small labels 

   showing the current pose name and confidence value, styled exactly like the 

   floating data labels in a scientific illustration. The meme overlay itself should 

   still feel vivid and colorful against the otherwise restrained dark UI — that pop 

   of color is where the joke lands.

## What NOT to do

- Don't make it look like a typical playful meme app (bright colors everywhere, 

  bouncy rounded shapes) — the whole comedic effect depends on it looking serious 

  and clinical

- Don't overcrowd the UI with dense card layouts — keep it sparse, dark, and precise

- Don't lose camera feed readability under heavy texture/grain — keep the noise 

  overlay subtle enough that the live video stays clear

Build this as a polished, production-quality UI — this should look like something 

a real design team shipped, not a hackathon mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9798b8a3-db4e-4209-b174-742f93011345).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
