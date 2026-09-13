Language: EN | [简中](README.zh-CN.md)

<p align="center">
  <img src="https://img.shields.io/badge/macOS%20%7C%20Windows%20%7C%20Linux-111827?style=for-the-badge" alt="macOS Windows Linux" />
  <img src="https://img.shields.io/badge/open%20source-AGPL3.0-6d4fd1?style=for-the-badge" alt="AGPL 3.0 license" />
</p>

### Create polished client showcase videos in minutes
Unveil is our agency's screen recorder and editor for presenting the websites and apps we build for clients — walkthroughs, demos, and portfolio-ready showcase videos.
Unveil is a fork of the open-source [Recordly](https://www.recordly.dev) project, adapted for our own workflow.

> Logo and product screenshots coming soon — this fork doesn't reuse Recordly's branding assets.

---

## What is Unveil?

Unveil is a desktop app for recording and editing screen captures with motion-driven presentation tools built in. Instead of sending raw footage to a motion designer just to add zooms, cursor polish, or a styled background, Unveil handles that workflow in one place — built for showing off client websites the way they deserve to be shown.

Unveil runs on:

- **macOS** 14.0+
- **Windows** 10 Build 19041+
- **Linux** on modern distros

Platform notes:

- **macOS** uses native ScreenCaptureKit-based capture helpers.
- **Windows** uses a native Windows Graphics Capture (WGC) helper on supported builds, with native WASAPI audio support.
- **Linux** records through Electron capture APIs. Cursor hiding is not supported on Linux today.

---

# Core Features

## Auto-zooms, cursor polish, and styled frames
Unveil can automatically emphasize activity with zoom suggestions, smooth cursor movement, add motion effects, and place the final composition inside a styled frame with wallpapers, colors, gradients, blur, padding, and shadows.

## Dynamic webcam bubble overlays
Add webcam footage as an overlay bubble, position it with presets or custom coordinates, mirror it, control shadow and roundness, and optionally make it react to zoom so it stays visually balanced during motion.

## Timeline editing built for demos
Use drag-and-drop timeline tools for zooms, trims, speed regions, annotations, extra audio regions, and crop-aware edits. Save and reopen work as `.unveil` project files (older `.recordly` files still open).

## Extensions & Marketplace

> [!NOTE]
> The extension system is currently disabled in this codebase (the in-app Extensions screen shows a placeholder). The description below reflects the documented design in `EXTENSIONS.md`, not current runtime behavior.

Recordly's design includes a community-driven extension system for adding capabilities like cursor click sounds, device frames, browser mockups, wallpapers, render hooks, and settings panels. Unveil inherits this same architecture but does not currently load or run extensions.

---

## All Features

### Recording

- Record an entire display or a single app window
- Jump directly from recording into the editor
- Capture microphone audio and system audio
- Use native capture backends where supported
- Resume editing from saved `.unveil` project files
- Open existing recordings or existing project files from the app

### Timeline and Editing

- Drag-and-drop timeline editing
- Trim unwanted sections
- Add manual zoom regions
- Use automatic zoom suggestions based on cursor activity
- Add speed-up and slow-down regions
- Add text, image, and figure annotations
- Add extra audio regions on the timeline
- Crop the recorded frame
- Save and reopen projects with editor state preserved

### Cursor Controls

- Show or hide the rendered cursor overlay
- Cursor size adjustment
- Cursor smoothing
- Cursor motion blur
- Cursor click bounce
- Cursor sway
- Cursor loop mode for cleaner looping exports
- macOS-style cursor assets for the rendered overlay

### Webcam Overlay

- Enable or disable webcam overlay footage
- Upload, replace, or remove webcam footage
- Mirror webcam footage
- Size control
- Preset positions and custom X/Y placement
- Margin control
- Roundness control
- Shadow control
- Optional zoom-reactive webcam scaling

### Frame Styling and Backgrounds

- Built-in wallpapers
- Runtime wallpaper discovery from the wallpapers directory
- Custom uploaded backgrounds
- Solid color backgrounds
- Gradient backgrounds
- Frame padding
- Rounded corners
- Background blur
- Drop shadows
- Aspect ratio presets for the final frame

### Export

- MP4 export
- GIF export
- Export quality selection
- GIF frame-rate selection
- GIF loop toggle
- GIF size presets
- Aspect ratio and output dimension controls
- Reveal exported files in the system file manager

### Workflow and Usability

- Customizable keyboard shortcuts
- In-app shortcut reference
- Feedback and issue links from the editor
- Project persistence for editor preferences
- Faster preview recovery after export
---

# Screenshots

Screenshots of Unveil's actual interface will go here once we have them — the ones previously here were Recordly's own screenshots and didn't belong in this fork's README.

---

# Installation

## Download a build

Unveil doesn't have its own published releases yet — build it from source below. (The original Recordly project's prebuilt releases are at [github.com/webadderallorg/Recordly/releases](https://github.com/webadderallorg/Recordly/releases), but those are unmodified upstream builds, not Unveil.)

---

## Build from source

### Prerequisites

**macOS:** Xcode Command Line Tools (`xcode-select --install`).

**Linux (Ubuntu/Debian):**

```bash
sudo apt install build-essential cmake libx11-dev libxtst-dev libxrandr-dev libxt-dev
```

**Windows:** Visual Studio 2022 (or Build Tools) with the C++ workload and CMake.

### Steps

```bash
git clone https://github.com/innovatewithkishlay/Recordly.git unveil
cd unveil
npm install
npm run dev
```

For packaged builds:

```bash
npm run build
```

Target-specific build commands are also available:

- `npm run build:mac`
- `npm run build:win`
- `npm run build:linux`

---

## macOS: "App cannot be opened"

Locally built apps may be quarantined by macOS.

Remove the quarantine flag with:

```bash
xattr -rd com.apple.quarantine /Applications/Unveil.app
```

---

# System Requirements

| Platform | Minimum version | Notes |
|---|---|---|
| **macOS** | macOS 14.0 (Sonoma) | Required for ScreenCaptureKit audio and microphone capture. |
| **Windows** | Windows 10 20H1 (Build 19041, May 2020) | Required for the native Windows Graphics Capture (WGC) helper and best cursor-hiding behavior. |
| **Linux** | Any modern distro | Recording works through Electron capture. System audio generally requires PipeWire. |

> [!IMPORTANT]
> On Windows builds older than 19041, recording can still work through fallback capture, but the real OS cursor may remain visible in recordings.

---

# Usage

## Record

1. Launch Unveil.
2. Select a screen or window.
3. Choose microphone and system-audio options.
4. Start recording.
5. Stop recording to open the editor.

## Edit

Inside the editor you can:

- add trims, zooms, speed regions, and annotations
- tune cursor behavior and preview volume
- style the frame with wallpapers, colors, gradients, blur, padding, and corners
- add or adjust webcam overlay footage
- add extra audio regions
- crop the frame and choose an aspect ratio

Save your work anytime as a `.unveil` project.

## Export

Export options include:

- **MP4** for standard video output
- **GIF** for lightweight sharing and loops

You can adjust format-specific settings such as quality, GIF frame rate, GIF looping, and output size before export.

---

# Limitations

### Cursor capture

Unveil renders a polished cursor overlay on top of the recording. Platform cursor-hiding behavior still depends on OS support.

**macOS**
- ScreenCaptureKit can exclude the real cursor cleanly.

**Windows**
- Best results require Windows 10 Build 19041+ and the native capture helper.
- Older builds fall back to Electron capture, so the real cursor may remain visible.

**Linux**
- Electron desktop capture does not currently support cursor hiding.
- If you also enable the rendered cursor overlay, exports may show both the real cursor and the styled cursor.

### System audio

System audio support varies by platform.

**Windows**
- Native WASAPI support

**Linux**
- Usually requires PipeWire

**macOS**
- Requires macOS 14.0+ and the ScreenCaptureKit-based workflow

---

# How It Works

Unveil combines a platform-specific capture layer with a renderer-driven editor and export pipeline.

**Capture**
- Electron coordinates recording and application flow
- macOS uses native ScreenCaptureKit helpers
- Windows uses a native Windows Graphics Capture (WGC) helper and native audio helpers where available

**Editing**
- Timeline regions define zooms, trims, speed changes, audio overlays, and annotations
- Cursor and webcam styling are applied in the editor state

**Rendering**
- Scene composition is handled by **PixiJS**

**Export**
- The same scene logic used in preview is rendered into exported MP4 or GIF output

**Projects**
- `.recordly` files store the source media path plus editor state so work can be reopened later

---

# Contribution

Contributions are welcome.

Areas where help is especially useful:

- Linux capture and cursor behavior
- Export performance and stability
- UI and UX refinement
- Localisation work
- Additional editor tools and workflow polish

Please keep pull requests focused, test recording/edit/export flows, and avoid unrelated refactors.

See `CONTRIBUTING.md` for guidelines.

---

# Community

Bug reports and feature requests for this fork:

https://github.com/innovatewithkishlay/Recordly/issues

---

# Hall of Supporters (Recordly, upstream)

The list below credits supporters of the original Recordly project this fork is built on — not Unveil itself.

[![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/webadderall)

- Tom Egan @tomegan on X
- Robin Ebers @robinebers on X
- Tadees
- buildwithfur
- piccinato
- Tobias
- Anonymous Supporter
- Tandava Appadoo
- Digitalfastmind
- Roberto Marcelino
- Tony
- Rajan RK
- Francesco
- Erwan
- Anonymous supporter

---

# License

Unveil is a fork of Recordly and, like Recordly, is licensed under the **AGPL 3.0**.

---

# Credits

## Acknowledgements

Unveil is built on top of [Recordly](https://www.recordly.dev), an open-source screen recorder, adapted here for our agency's client-showcase workflow.

Recordly itself originally started as a fork of [OpenScreen](https://github.com/siddharthvaddem/openscreen). Over 80% of code has diverged since.
Many features of OpenScreen such as its zoom animations are directly ported from early versions of Recordly.

Recordly created by  
[@webadderall](https://x.com/webadderall)

---
