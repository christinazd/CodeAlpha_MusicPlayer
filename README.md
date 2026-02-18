# Pulsewave Music Player

A premium, glassmorphism-inspired music player built with HTML, CSS, and
vanilla JavaScript. It features smooth micro-interactions, animated progress
and volume controls, rotating album art, and a dynamic playlist UI.

## Features

- Play, pause, next, previous
- Real-time progress tracking and seek
- Autoplay next track
- Volume slider with mute toggle
- Dynamic album art and theme accents
- Active track glow and ripple button effects
- Responsive layout for mobile and desktop

## Tech Stack

- HTML5
- CSS3 (glassmorphism + neumorphism mix)
- Vanilla JavaScript (Media API)

## Project Structure

```
.
├── index.html
├── style.css
├── script.js
└── tracks/
    ├── song1.mp3
    ├── song2.mp3
    ├── song3.mp3
    └── song4.mp3
```

## Getting Started

1. Keep your audio files inside the `tracks/` folder.
2. Open `index.html` in a browser.

Note: Some browsers block autoplay without user interaction. Click play to
start audio.

## Usage

- Click a track in the playlist to switch and start playback.
- Drag the progress bar thumb to seek.
- Adjust volume with the slider or toggle mute.

## Customization

- Update track names, artists, and colors in `script.js`.
- Replace the generated SVG album art by setting `artwork.src` to real images.
- Tweak UI colors and shadows in `style.css`.

## Preview

Add a screenshot named `preview.png` to the project root to show it here.

![Music player preview](preview.png)

