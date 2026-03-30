---
description: Scaffold an animated video project using Remotion (React-based programmatic video)
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx create-video@latest*", "npm install*", "npm run dev*"]
  network: true
  destructive: false
---

Scaffold a new Remotion video project using `npx create-video@latest`.

Remotion lets you create videos programmatically with React — animated web pages, motion graphics, TikToks, audiograms, 3D scenes, and more.

Steps:

1. **Parse the user request** from `$ARGUMENTS` to determine:
   - Project name (default: `my-video`)
   - Template preference (see available templates below)
   - Any specific requirements (dimensions, FPS, duration, theme)

2. **Select the best template** based on the request:

   | Template | Best for |
   |---|---|
   | `--hello-world` | General starter, first projects |
   | `--blank` | Starting from scratch |
   | `--three` | 3D animations with Three.js |
   | `--audiogram` | Audio waveform visualizations |
   | `--music-visualization` | Music visualizers |
   | `--tiktok` | TikTok-format vertical videos |
   | `--overlay` | Video overlays and lower thirds |
   | `--skia` | High-performance 2D graphics |
   | `--code-hike` | Code animation walkthroughs |
   | `--stargazer` | GitHub stargazer animations |
   | `--next` | Next.js integration |
   | `--still` | Static image/thumbnail generation |
   | `--prompt-to-video` | AI-assisted video generation |

3. **Run the scaffolding command:**
   ```
   npx create-video@latest --yes --<template> <project-name>
   ```
   Use `--yes` to skip interactive prompts.

4. **Review the generated project structure** and explain:
   - `src/Root.tsx` — where compositions are defined
   - `src/Composition.tsx` — video content as React components
   - `public/` — static assets (images, audio, fonts)
   - Key Remotion concepts: `<Composition>`, `useCurrentFrame()`, `interpolate()`, `spring()`

5. **Customize the project** based on user requirements:
   - Adjust video dimensions (default 1920x1080) and FPS (default 30)
   - Create or modify compositions to match the requested content
   - Add animations using Remotion's `interpolate()`, `spring()`, and `Sequence` APIs
   - Set up proper scene structure with `<AbsoluteFill>`, `<Sequence>`, and `<Series>`
   - Add any needed assets to `public/`

6. **Provide next steps:**
   - `npm run dev` — Start Remotion Studio for live preview
   - `npx remotion render src/index.ts <CompositionId> out/video.mp4` — Render to file
   - `npx remotion still src/index.ts <CompositionId> out/thumbnail.png` — Render a still frame
   - Explain how to tweak props, duration, and add new scenes

Request: $ARGUMENTS
