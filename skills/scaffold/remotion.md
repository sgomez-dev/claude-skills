---
description: Remotion video creation in React — compositions, animations, audio, transitions, text effects
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "npx create-video", "npx remotion render"]
  network: false
  destructive: false
---

# Remotion Video Creation

You are an expert at building programmatic videos with Remotion — React components rendered as video frames.

## What Is Remotion?

Remotion lets you write videos as React components. Each frame is a React render at a specific point in time. You use `useCurrentFrame()` and `interpolate()` to drive animations, and Remotion renders them to MP4/WebM.

## When to Use Remotion

- Programmatic/data-driven videos (dashboards, changelogs, reports)
- Templated video generation (social clips, product demos)
- Text animation sequences
- Videos that need to be generated from code/APIs
- NOT for: hand-crafted cinematic work (use After Effects), real-time interactive (use GSAP/Canvas)

## Setup

```bash
npx create-video@latest my-video
cd my-video
npm start           # Preview at localhost:3000
npx remotion render src/index.ts MyComp out/video.mp4
```

## Key Concepts

### Composition (the "canvas")

```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={300}   // 10s at 30fps
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: "Hello" }}
  />
);
```

### useCurrentFrame + interpolate

```tsx
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const MyVideo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Linear interpolation
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Spring animation (physics-based, no easing needed)
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });

  // Translate with spring
  const translateY = interpolate(spring({ frame, fps, delay: 10 }), [0, 1], [50, 0]);

  return (
    <div style={{ opacity, transform: `scale(${scale}) translateY(${translateY}px)` }}>
      <h1>{title}</h1>
    </div>
  );
};
```

### Sequences (timing sections)

```tsx
import { Sequence } from "remotion";

export const MyVideo = () => (
  <>
    {/* Plays frames 0-59 (2 seconds) */}
    <Sequence from={0} durationInFrames={60}>
      <IntroScene />
    </Sequence>

    {/* Plays frames 60-179 */}
    <Sequence from={60} durationInFrames={120}>
      <MainContent />
    </Sequence>

    {/* From frame 180 to end */}
    <Sequence from={180}>
      <OutroScene />
    </Sequence>
  </>
);
```

Inside a `<Sequence>`, `useCurrentFrame()` resets to 0 — so each scene's animations are self-contained.

### Audio

```tsx
import { Audio, staticFile, interpolate, useCurrentFrame } from "remotion";

// Static file from public/ folder
<Audio src={staticFile("music.mp3")} volume={0.5} />

// Fade audio in/out
const frame = useCurrentFrame();
const volume = interpolate(frame, [0, 30, 270, 300], [0, 0.8, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
<Audio src={staticFile("music.mp3")} volume={volume} />
```

### Transitions

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

export const MyVideo = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={90}>
      <SceneA />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: 15 })}
    />
    <TransitionSeries.Sequence durationInFrames={90}>
      <SceneB />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-left" })}
      timing={linearTiming({ durationInFrames: 20 })}
    />
    <TransitionSeries.Sequence durationInFrames={90}>
      <SceneC />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
```

### Text Animations

```tsx
// Word-by-word reveal
const TextReveal: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {words.map((word, i) => {
        const delay = i * 5;
        const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(frame, [delay, delay + 10], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span key={i} style={{ opacity, transform: `translateY(${y}px)` }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};
```

## Common Patterns

### Staggered element entrance
```tsx
const items = ["Feature 1", "Feature 2", "Feature 3"];
items.map((item, i) => {
  const delay = i * 8;
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const x = interpolate(progress, [0, 1], [-40, 0]);
  return <div style={{ opacity, transform: `translateX(${x}px)` }}>{item}</div>;
});
```

### Background with moving gradient
```tsx
const rotation = interpolate(frame, [0, 300], [0, 360]);
<div style={{
  background: `conic-gradient(from ${rotation}deg, #ff6b6b, #4ecdc4, #45b7d1, #ff6b6b)`,
  filter: "blur(80px)", opacity: 0.6,
}} />
```

## Best Practices

1. **Use `spring()` over manual easing** — physics-based looks more natural and handles overshooting
2. **Always `extrapolateRight: "clamp"`** — prevents values drifting beyond intended range
3. **Keep components pure** — no side effects; every render must produce identical output for the same frame
4. **Use `<Sequence>` for organization** — each scene gets its own frame counter
5. **Static assets in `public/`** — reference with `staticFile("filename")`
6. **Render with `--concurrency`** — `npx remotion render --concurrency=4` for faster output
7. **Preview before render** — `npm start` opens browser preview with timeline scrubbing
8. **Use `<Img>` and `<Video>` from remotion** — they handle loading states properly

## Rendering

```bash
# MP4 (default)
npx remotion render src/index.ts MyVideo out/video.mp4

# Specific frames (for testing)
npx remotion render src/index.ts MyVideo out/test.mp4 --frames=0-90

# GIF
npx remotion render src/index.ts MyVideo out/video.gif --image-format=png

# With props
npx remotion render src/index.ts MyVideo out/video.mp4 --props='{"title":"Custom"}'
```

$ARGUMENTS
