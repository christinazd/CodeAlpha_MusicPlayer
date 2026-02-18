const tracks = [
  {
    title: "Nebula Drift",
    artist: "Astra",
    src: "tracks/song1.mp3",
    colors: ["#7b9bff", "#38f3ff", "#1b2b6f"],
  },
  {
    title: "Midnight Pulse",
    artist: "Luma",
    src: "tracks/song2.mp3",
    colors: ["#d17cff", "#7b9bff", "#3a1a5f"],
  },
  {
    title: "Solar Echo",
    artist: "Nova Sway",
    src: "tracks/song3.mp3",
    colors: ["#38f3ff", "#7b9bff", "#102a45"],
  },
  {
    title: "Aurora Lines",
    artist: "Kyra",
    src: "tracks/song4.mp3",
    colors: ["#f8c8ff", "#d17cff", "#2f1740"],
  },
];

const audio = document.getElementById("audio");
const artwork = document.getElementById("artwork");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const muteBtn = document.getElementById("mute");
const playlistEl = document.getElementById("playlist");
const trackCountEl = document.getElementById("track-count");
const playerCard = document.querySelector(".player-card");

let currentIndex = 0;
let isSeeking = false;
let lastVolume = 0.8;

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const createArtwork = (track) => {
  const [c1, c2, c3] = track.colors;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="60%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
      </defs>
      <rect width="640" height="640" fill="url(#g1)" />
      <circle cx="160" cy="160" r="120" fill="rgba(255,255,255,0.18)" />
      <circle cx="520" cy="520" r="140" fill="rgba(255,255,255,0.12)" />
      <text x="50%" y="78%" fill="rgba(255,255,255,0.75)" font-size="36" font-family="Segoe UI, Arial" text-anchor="middle">
        ${track.title}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const applyTheme = (track) => {
  const [accent1, accent2, accent3] = track.colors;
  document.documentElement.style.setProperty("--accent-1", accent1);
  document.documentElement.style.setProperty("--accent-2", accent2);
  document.documentElement.style.setProperty("--accent-3", accent3);
};

const updateProgress = (percent) => {
  const safe = Number.isFinite(percent) ? percent : 0;
  progress.value = safe;
  progress.style.setProperty("--progress", `${safe}%`);
};

const updateVolumeBar = (value) => {
  volume.value = value;
  volume.style.setProperty("--progress", `${value}%`);
};

const setActiveTrack = (index) => {
  document.querySelectorAll(".track-item").forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.index) === index);
  });
};

const setTrack = (index, shouldPlay = false) => {
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];
  playerCard.classList.add("is-switching");

  songTitle.textContent = track.title;
  songArtist.textContent = track.artist;
  artwork.src = createArtwork(track);
  artwork.alt = `${track.title} album art`;
  applyTheme(track);
  audio.src = track.src;
  audio.load();

  setActiveTrack(currentIndex);
  setTimeout(() => playerCard.classList.remove("is-switching"), 320);

  if (shouldPlay) {
    audio.play().catch(() => {
      playBtn.classList.remove("is-playing");
      artwork.classList.remove("is-playing");
      playBtn.setAttribute("aria-pressed", "false");
    });
  }
};

const buildPlaylist = () => {
  playlistEl.innerHTML = "";
  tracks.forEach((track, index) => {
    const item = document.createElement("li");
    item.className = "track-item";
    item.dataset.index = index.toString();
    item.innerHTML = `
      <div class="track-info">
        <span class="track-title">${track.title}</span>
        <span class="track-artist">${track.artist}</span>
      </div>
    `;
    item.addEventListener("click", () => {
      setTrack(index, true);
    });
    playlistEl.appendChild(item);
  });

  trackCountEl.textContent = `${tracks.length} tracks`;
};

const updateMuteState = () => {
  const isMuted = audio.muted || audio.volume === 0;
  muteBtn.classList.toggle("is-muted", isMuted);
};

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => null);
  } else {
    audio.pause();
  }
});

prevBtn.addEventListener("click", () => {
  setTrack(currentIndex - 1, !audio.paused);
});

nextBtn.addEventListener("click", () => {
  setTrack(currentIndex + 1, !audio.paused);
});

progress.addEventListener("pointerdown", () => {
  isSeeking = true;
});

progress.addEventListener("pointerup", () => {
  isSeeking = false;
});

progress.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  updateProgress(value);
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (value / 100) * audio.duration;
  }
});

volume.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  const nextVolume = Math.max(0, Math.min(1, value / 100));
  audio.volume = nextVolume;
  audio.muted = nextVolume === 0;
  if (nextVolume > 0) {
    lastVolume = nextVolume;
  }
  updateMuteState();
  updateVolumeBar(value);
});

muteBtn.addEventListener("click", () => {
  if (audio.muted || audio.volume === 0) {
    audio.muted = false;
    audio.volume = lastVolume || 0.8;
  } else {
    lastVolume = audio.volume;
    audio.muted = true;
  }
  updateMuteState();
  updateVolumeBar(Math.round(audio.volume * 100));
});

audio.addEventListener("timeupdate", () => {
  if (!isSeeking) {
    const percent = (audio.currentTime / audio.duration) * 100;
    updateProgress(percent || 0);
  }
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audio.duration);
  updateProgress(0);
});

audio.addEventListener("play", () => {
  playBtn.classList.add("is-playing");
  artwork.classList.add("is-playing");
  playBtn.setAttribute("aria-pressed", "true");
});

audio.addEventListener("pause", () => {
  playBtn.classList.remove("is-playing");
  artwork.classList.remove("is-playing");
  playBtn.setAttribute("aria-pressed", "false");
});

audio.addEventListener("ended", () => {
  setTrack(currentIndex + 1, true);
});

document.querySelectorAll(".control-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const ripple = document.createElement("span");
    const size = Math.max(button.clientWidth, button.clientHeight);
    const rect = button.getBoundingClientRect();
    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

buildPlaylist();
setTrack(0, false);
audio.volume = 0.8;
updateVolumeBar(80);
updateMuteState();
