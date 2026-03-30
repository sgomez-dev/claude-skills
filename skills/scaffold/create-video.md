---
description: Bootstrap a NEW video project from scratch with npx create-video — picks the right Remotion template, scaffolds, and customizes it ready to preview
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx create-video@latest*", "npm install*", "npm run dev*"]
  network: true
  destructive: false
---

# Create Video Project (npx create-video)

Bootstrap a brand-new Remotion video project from zero using `npx create-video@latest`.

> **How is this different from the `remotion` skill?**
> - **This skill (`create-video`)** → Creates a NEW project from scratch. Runs `npx create-video@latest`, picks the right template, installs dependencies, and gets you to a working preview. Use this when you don't have a project yet.
> - **The `remotion` skill** → A coding reference for writing Remotion components (animations, transitions, audio, text effects) inside an EXISTING project. Use that when you already have a Remotion project and need to build or edit video scenes.
>
> **TL;DR:** `create-video` = "set up the project" → `remotion` = "write the video code"

## What is Remotion?

Remotion is a React framework that turns React components into real video files (MP4, WebM, GIF). Every frame of the video is a React render. You write JSX, use CSS/Tailwind, and Remotion renders it frame-by-frame into a video. It includes a browser-based Studio with a timeline, live preview with hot reload, and a visual props editor.

## Steps

1. **Parse the user request** from `$ARGUMENTS` to determine:
   - **Project name** (default: `my-video`)
   - **What they want to create** — this determines the template
   - **Format** — landscape (1920×1080), vertical/TikTok (1080×1920), square (1080×1080), etc.
   - **Any specific needs** — 3D, audio visualization, code demos, AI-generated content

2. **Select the best template** based on what the user wants to build:

   | Template flag | Use when the user wants... |
   |---|---|
   | `--hello-world` | A general starter to learn or experiment — **best default choice** |
   | `--blank` | A completely empty canvas, no example code |
   | `--three` | 3D animations, rotating objects, particle systems (uses Three.js + React Three Fiber) |
   | `--audiogram` | Podcast clips, audio waveform visualizations with subtitles |
   | `--music-visualization` | Audio-reactive visuals, equalizers, music videos |
   | `--tiktok` | Vertical short-form content (9:16 ratio), social media clips |
   | `--overlay` | Lower thirds, stream overlays, transparent-background graphics |
   | `--skia` | High-performance 2D vector graphics, charts, complex shapes (uses React Native Skia) |
   | `--code-hike` | Code walkthroughs, syntax-highlighted animated code demos |
   | `--stargazer` | GitHub repo showcase animations (star count, contributor growth) |
   | `--next` | Embed Remotion rendering inside a Next.js web app (with Tailwind) |
   | `--next-no-tailwind` | Same as above but without Tailwind CSS |
   | `--still` | Static image generation only (thumbnails, social cards, OG images) — no video |
   | `--prompt-to-video` | AI-powered video generation from text prompts |
   | `--prompt-to-motion-graphics` | AI-powered motion graphics from text descriptions |
   | `--javascript` | JavaScript instead of TypeScript (for users who prefer JS) |
   | `--react-router` | Integration with React Router for app-embedded video rendering |
   | `--recorder` | Screen recording tool built with Remotion |

   **Decision guide:**
   - Not sure / first time → `--hello-world`
   - Social media content → `--tiktok`
   - Anything 3D → `--three`
   - Audio/music related → `--audiogram` or `--music-visualization`
   - Developer content (code demos) → `--code-hike`
   - Needs to live inside a web app → `--next`
   - Just images, no video → `--still`

3. **Run the scaffolding command:**
   ```bash
   npx create-video@latest --yes --<template> <project-name>
   ```
   - `--yes` skips all interactive prompts
   - Add `--no-tailwind` if the user explicitly doesn't want Tailwind

4. **Walk through the generated project structure:**
   ```
   <project-name>/
   ├── public/              # Static assets — images, audio, fonts, video clips
   ├── src/
   │   ├── index.ts         # Entry point — calls registerRoot()
   │   ├── Root.tsx          # Defines all <Composition>s (the video "canvases")
   │   └── MyComp.tsx        # The actual video content (React components)
   ├── package.json
   └── tsconfig.json
   ```

   Explain the key parts:
   - **`Root.tsx`** — This is where you register your videos. Each `<Composition>` defines a video with its ID, dimensions, FPS, and duration
   - **Component files** — Your video scenes are just React components. `useCurrentFrame()` gives the current frame number, and you use it to drive animations
   - **`public/`** — Put any media files here and reference them with `staticFile("filename.png")`

5. **Customize the scaffolded project** based on the user's specific request:
   - Adjust `width`, `height`, `fps`, and `durationInFrames` in `Root.tsx`
   - Rename the composition ID to something meaningful
   - Modify or create scene components to match what the user described
   - Set up initial styling (colors, fonts, layout)
   - If the user mentioned specific assets, explain where to place them in `public/`

6. **Start the preview and explain how to use it:**
   ```bash
   cd <project-name>
   npm run dev
   ```
   This opens **Remotion Studio** at `localhost:3000` where you can:
   - Scrub through the timeline frame-by-frame
   - See live hot-reloaded changes as you edit code
   - Edit props visually in the sidebar (if using Zod schemas)
   - Click "Render" to export directly from the UI

7. **Show render commands for when they're ready to export:**
   ```bash
   # Render to MP4
   npx remotion render src/index.ts <CompositionId> out/video.mp4

   # Render just a thumbnail/still (frame 0)
   npx remotion still src/index.ts <CompositionId> out/thumbnail.png

   # Render a specific frame range (for testing)
   npx remotion render src/index.ts <CompositionId> out/test.mp4 --frames=0-90

   # Render as GIF
   npx remotion render src/index.ts <CompositionId> out/video.gif

   # Render with custom props
   npx remotion render src/index.ts <CompositionId> out/video.mp4 --props='{"title":"My Title"}'

   # Faster rendering with concurrency
   npx remotion render src/index.ts <CompositionId> out/video.mp4 --concurrency=4
   ```

8. **Suggest next steps** based on what the user wants to build:
   - Point them to the `remotion` skill for learning animation patterns (interpolate, spring, Sequence, transitions)
   - Suggest installing additional packages if needed (`@remotion/three`, `@remotion/transitions`, `@remotion/media-utils`)
   - Mention that Remotion requires a commercial license for companies with 4+ employees

Request: $ARGUMENTS
