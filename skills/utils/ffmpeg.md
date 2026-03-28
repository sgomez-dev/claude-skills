---
description: FFmpeg video/audio processing — convert, resize, compress, trim, concatenate, platform export
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["ffmpeg", "ffprobe"]
  network: false
  destructive: false
---

# FFmpeg Command Reference

You are an expert at FFmpeg video/audio processing. Generate precise ffmpeg commands for the user's needs.

## Get File Info

```bash
# Full probe
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4

# Quick summary
ffprobe -v quiet -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height,r_frame_rate -of compact input.mp4
```

## Format Conversion

### GIF to MP4 (dramatically smaller)
```bash
ffmpeg -i input.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" output.mp4
```

### MP4 to GIF (high quality)
```bash
# Generate palette first for better colors
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,palettegen" palette.png
ffmpeg -i input.mp4 -i palette.png -lavfi "fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse" output.gif
```

### MOV to MP4
```bash
ffmpeg -i input.mov -c:v libx264 -c:a aac -movflags faststart output.mp4
```

### MKV to MP4 (fast remux if codecs compatible)
```bash
ffmpeg -i input.mkv -c copy output.mp4
```

### Video to Audio Only
```bash
ffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 output.mp3     # MP3
ffmpeg -i input.mp4 -vn -c:a aac -b:a 192k output.m4a          # AAC
ffmpeg -i input.mp4 -vn -c:a copy output.aac                    # Extract without re-encoding
```

### Audio Format Conversion
```bash
ffmpeg -i input.wav -c:a libmp3lame -b:a 320k output.mp3
ffmpeg -i input.mp3 -c:a aac -b:a 256k output.m4a
ffmpeg -i input.flac -c:a libopus -b:a 128k output.opus
```

## Resize

```bash
# Specific dimensions (even numbers required for h264)
ffmpeg -i input.mp4 -vf "scale=1920:1080" -c:a copy output.mp4

# Scale by width, preserve aspect ratio
ffmpeg -i input.mp4 -vf "scale=1280:-2" -c:a copy output.mp4

# Scale by height
ffmpeg -i input.mp4 -vf "scale=-2:720" -c:a copy output.mp4

# Scale to 50%
ffmpeg -i input.mp4 -vf "scale=iw/2:ih/2" -c:a copy output.mp4
```

## Compress

```bash
# Good quality, reasonable size (CRF 23 = default, lower = better quality)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4

# Aggressive compression (web/email)
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -vf "scale=1280:-2" -c:a aac -b:a 96k output.mp4

# H.265/HEVC (50% smaller, slower encode)
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset medium -c:a aac -b:a 128k output.mp4

# Target file size (~10MB for a 60s video)
ffmpeg -i input.mp4 -c:v libx264 -b:v 1200k -pass 1 -f null /dev/null && \
ffmpeg -i input.mp4 -c:v libx264 -b:v 1200k -pass 2 -c:a aac -b:a 128k output.mp4
```

## Trim & Cut

```bash
# By timestamp (fast, no re-encode — may be slightly inaccurate at start)
ffmpeg -ss 00:01:30 -to 00:03:00 -i input.mp4 -c copy output.mp4

# Precise trim (re-encodes)
ffmpeg -i input.mp4 -ss 00:01:30 -to 00:03:00 -c:v libx264 -c:a aac output.mp4

# First 30 seconds
ffmpeg -i input.mp4 -t 30 -c copy output.mp4

# Remove first 10 seconds
ffmpeg -ss 10 -i input.mp4 -c copy output.mp4
```

## Speed Up / Slow Down

```bash
# 2x speed (video + audio)
ffmpeg -i input.mp4 -vf "setpts=0.5*PTS" -af "atempo=2.0" output.mp4

# 0.5x speed (slow motion)
ffmpeg -i input.mp4 -vf "setpts=2.0*PTS" -af "atempo=0.5" output.mp4

# 4x speed (chain atempo for >2x audio)
ffmpeg -i input.mp4 -vf "setpts=0.25*PTS" -af "atempo=2.0,atempo=2.0" output.mp4
```

## Concatenate

```bash
# Create file list
cat > filelist.txt << 'EOF'
file 'part1.mp4'
file 'part2.mp4'
file 'part3.mp4'
EOF

# Concat (same codec/resolution — fast)
ffmpeg -f concat -safe 0 -i filelist.txt -c copy output.mp4

# Concat (different formats — re-encodes)
ffmpeg -f concat -safe 0 -i filelist.txt -c:v libx264 -c:a aac output.mp4
```

## Fade In / Out

```bash
# Fade in first 1s, fade out last 1s of a 60s video
ffmpeg -i input.mp4 -vf "fade=in:0:30,fade=out:1770:30" -af "afade=in:0:44100,afade=out:st=59:d=1" output.mp4

# Just video fade (30 frames = 1s at 30fps)
ffmpeg -i input.mp4 -vf "fade=in:st=0:d=1,fade=out:st=59:d=1" output.mp4
```

## Add Overlay / Watermark

```bash
# Image watermark (bottom-right with padding)
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=W-w-10:H-h-10" output.mp4

# Text overlay
ffmpeg -i input.mp4 -vf "drawtext=text='Hello':fontsize=48:fontcolor=white:x=50:y=50" output.mp4
```

## Create Thumbnail / Screenshots

```bash
# Single frame at 5 seconds
ffmpeg -ss 5 -i input.mp4 -frames:v 1 thumbnail.jpg

# One frame per second
ffmpeg -i input.mp4 -vf "fps=1" frame_%04d.jpg

# Tile sheet (4x4 grid)
ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-1,tile=4x4" contact_sheet.jpg
```

## Platform-Specific Export

### YouTube (recommended)
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 256k -ar 48000 -movflags faststart -vf "scale=1920:1080" output.mp4
```

### Twitter/X (max 140s, 512MB)
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 128k -vf "scale=1280:720" -t 140 -movflags faststart output.mp4
```

### LinkedIn (max 10min, 5GB)
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 192k -vf "scale=1920:1080" -movflags faststart output.mp4
```

### Web (optimized for fast loading)
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 128k -vf "scale=1280:-2" -movflags faststart -profile:v main -level 3.1 output.mp4
```

### Instagram Reels (9:16, max 90s)
```bash
ffmpeg -i input.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:-1:-1:black" \
  -c:v libx264 -crf 20 -c:a aac -b:a 192k -t 90 -movflags faststart output.mp4
```

## Common Issues

| Problem | Solution |
|---------|----------|
| "height not divisible by 2" | Add `scale=trunc(iw/2)*2:trunc(ih/2)*2` |
| No audio after trim | Use `-c:a aac` instead of `-c copy` for audio |
| File won't play in browser | Add `-movflags faststart -pix_fmt yuv420p` |
| Concat fails | Ensure same resolution/codec or re-encode |
| Slow encoding | Use `-preset ultrafast` for drafts, `-preset slow` for final |
| Large file size | Increase CRF (e.g., 23 -> 28) or reduce resolution |
| Green artifacts | Add `-pix_fmt yuv420p` |

## CRF Quality Guide

| CRF | Quality | Use Case |
|-----|---------|----------|
| 0 | Lossless | Archival |
| 18 | Visually lossless | YouTube upload |
| 23 | Good (default) | General use |
| 28 | Decent | Web/email |
| 35+ | Low | Previews/drafts |

$ARGUMENTS
