let audioContext = null;
let timer = null;
let playing = false;

const bpm = document.getElementById("bpm");
const bpmValue = document.getElementById("bpmValue");

bpm.addEventListener("input", () => {
  bpmValue.textContent = bpm.value;

  if (playing) {
    stopBeat();
    startBeat();
  }
});

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone(type) {
  const ctx = getAudioContext();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === "kick") {
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

  } else if (type === "snare") {
    osc.type = "triangle";
    osc.frequency.value = 180;
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

  } else if (type === "hihat") {
    osc.type = "square";
    osc.frequency.value = 7000;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

  } else if (type === "clap") {
    osc.type = "sawtooth";
    osc.frequency.value = 900;
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
  }

  osc.start(now);
  osc.stop(now + 0.2);
}

document.querySelectorAll("[data-sound]").forEach(button => {
  button.addEventListener("click", () => {
    playTone(button.dataset.sound);
  });
});

function startBeat() {
  if (playing) return;

  playing = true;

  let step = 0;

  function tick() {
    if (!playing) return;

    if (step % 4 === 0) {
      playTone("kick");
    }

    if (step % 4 === 2) {
      playTone("snare");
    }

    playTone("hihat");

    step++;

    const interval = 60000 / Number(bpm.value) / 2;

    timer = setTimeout(tick, interval);
  }

  tick();
}

function stopBeat() {
  playing = false;

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

document.getElementById("play").addEventListener("click", () => {
  startBeat();
});

document.getElementById("stop").addEventListener("click", () => {
  stopBeat();
});


// -------------------------
// AI بخش سبک
// -------------------------

const aiResult = document.getElementById("aiResult");

document.getElementById("aiButton").addEventListener("click", async () => {

  const prompt = document.getElementById("prompt").value.trim();

  if (!prompt) {
    aiResult.textContent = "اول توضیح بده چه نوع بیتی می‌خوای.";
    return;
  }

  aiResult.textContent = "🤖 در حال ساخت ایده...";

  /*
    این قسمت فعلاً بدون API کار می‌کند.
    بعداً می‌توانیم آن را به API واقعی AI وصل کنیم.
  */

  setTimeout(() => {

    let suggestion = "بیت پیشنهادی:\n";

    if (
      prompt.includes("دارک") ||
      prompt.includes("dark")
    ) {
      suggestion +=
        "BPM: 90\nKick سنگین + Snare خشک + Hi-Hat سریع";
    } else if (
      prompt.includes("west") ||
      prompt.includes("وست")
    ) {
      suggestion +=
        "BPM: 96\n808 عمیق + Kick محکم + Clap کوتاه";
    } else {
      suggestion +=
        "BPM: 100\nKick / Snare / Hi-Hat با الگوی ساده رپ";
    }

    aiResult.textContent = suggestion;

  }, 400);
});


// -------------------------
// API Key
// -------------------------

const apiKey = document.getElementById("apiKey");

const savedKey = localStorage.getItem("amirBeatApiKey");

if (savedKey) {
  apiKey.value = savedKey;
}

document.getElementById("saveKey").addEventListener("click", () => {

  const key = apiKey.value.trim();

  if (!key) {
    alert("API Key را وارد کن.");
    return;
  }

  localStorage.setItem("amirBeatApiKey", key);

  alert("API Key روی همین دستگاه ذخیره شد.");
});


// -------------------------
// Audio File
// -------------------------

const audioFile = document.getElementById("audioFile");
const audioPlayer = document.getElementById("audioPlayer");

audioFile.addEventListener("change", () => {

  const file = audioFile.files[0];

  if (!file) return;

  const url = URL.createObjectURL(file);

  audioPlayer.src = url;
});