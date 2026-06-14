/* ============================================================
   THE STAGE - interactivity
   1. Spotlight follows the mouse
   2. Stats count up when scrolled into view
   3. Toastmasters timing lights react to scroll progress
   4. Q&A answers type out letter by letter
   5. SpeechLens live demo
   6. Gold dust particles
   ============================================================ */

/* ---------- 1. Spotlight ---------- */
const spotlight = document.getElementById("spotlight");
document.addEventListener("mousemove", (e) => {
  spotlight.style.setProperty("--mx", e.clientX + "px");
  spotlight.style.setProperty("--my", e.clientY + "px");

  /* Hero robot eyes follow cursor */
  const heroBot = document.getElementById("hero-bot");
  if (heroBot) {
    const rect = heroBot.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.22;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const dx = Math.cos(angle) * 5;
    const dy = Math.sin(angle) * 5;
    heroBot.querySelectorAll(".guard-pupil").forEach((p) => {
      p.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Hero robot — click to spew gold fire sideways from the mouth */
function spewFire(bot) {
  if (reducedMotion) return;
  const host = bot.querySelector(".guard-fire-host");
  if (!host) return;
  bot.classList.add("firing");
  const count = 24;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "fire-particle";
    const goLeft = i % 2 === 0;
    const spread = (Math.random() - 0.5) * 0.55;
    const angle = goLeft
      ? Math.PI + spread
      : spread;
    const dist = 70 + Math.random() * 90;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist * 0.35 + (Math.random() - 0.5) * 18;
    const size = 10 + Math.random() * 8;
    p.style.setProperty("--tx", tx + "px");
    p.style.setProperty("--ty", ty + "px");
    p.style.setProperty("--rot", (angle * (180 / Math.PI)) + "deg");
    p.style.setProperty("--fs", size + "px");
    host.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
  setTimeout(() => bot.classList.remove("firing"), 850);
}

const heroBot = document.getElementById("hero-bot");
if (heroBot) {
  heroBot.addEventListener("click", (e) => {
    e.stopPropagation();
    spewFire(heroBot);
  });
}

if (window.matchMedia("(pointer: coarse)").matches) {
  let t = 0;
  setInterval(() => {
    t += 0.02;
    const x = 50 + Math.sin(t) * 30;
    const y = 35 + Math.cos(t * 0.7) * 20;
    spotlight.style.setProperty("--mx", x + "vw");
    spotlight.style.setProperty("--my", y + "vh");
  }, 50);
}

/* ---------- 2. Reveal sections + animated counters ---------- */
document.querySelectorAll(".act > *, .project, .poster, .speaker-card").forEach((el) => {
  el.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".stat-num").forEach((el) => counterObserver.observe(el));

/* ---------- 3. Toastmasters timing lights ---------- */
const greenLight = document.getElementById("light-green");
const yellowLight = document.getElementById("light-yellow");
const redLight = document.getElementById("light-red");
const timingLabel = document.getElementById("timing-label");

function updateLights() {
  const progress =
    window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  greenLight.classList.toggle("on", progress < 0.45);
  yellowLight.classList.toggle("on", progress >= 0.45 && progress < 0.85);
  redLight.classList.toggle("on", progress >= 0.85);
  if (progress < 0.45) timingLabel.textContent = "ON TIME";
  else if (progress < 0.85) timingLabel.textContent = "WRAP UP";
  else timingLabel.textContent = "TIME'S UP";
}
window.addEventListener("scroll", updateLights, { passive: true });
updateLights();

/* ---------- 4. Q&A typing effect ---------- */
const qaText = document.getElementById("qa-text");
let typeTimer = null;

document.querySelectorAll(".qa-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".qa-q").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const answer = btn.dataset.a;
    clearInterval(typeTimer);
    qaText.textContent = "";
    qaText.classList.add("typing");

    let i = 0;
    typeTimer = setInterval(() => {
      qaText.textContent = answer.slice(0, ++i);
      if (i >= answer.length) {
        clearInterval(typeTimer);
        qaText.classList.remove("typing");
      }
    }, 14);
  });
});

/* ---------- 5. Gold dust ---------- */
const dustCanvas = document.getElementById("dust");
const ctx = dustCanvas.getContext("2d");
let motes = [];

function resizeDust() {
  dustCanvas.width = window.innerWidth;
  dustCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeDust);
resizeDust();

for (let i = 0; i < 38; i++) {
  motes.push({
    x: Math.random() * dustCanvas.width,
    y: Math.random() * dustCanvas.height,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -(Math.random() * 0.22 + 0.04),
    a: Math.random() * 0.5 + 0.12,
    phase: Math.random() * Math.PI * 2,
  });
}

function drawDust(t) {
  ctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
  motes.forEach((m) => {
    m.x += m.vx + Math.sin(t / 2400 + m.phase) * 0.08;
    m.y += m.vy;
    if (m.y < -5) { m.y = dustCanvas.height + 5; m.x = Math.random() * dustCanvas.width; }
    if (m.x < -5) m.x = dustCanvas.width + 5;
    if (m.x > dustCanvas.width + 5) m.x = -5;
    const twinkle = 0.6 + 0.4 * Math.sin(t / 900 + m.phase);
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240, 180, 41, ${m.a * twinkle})`;
    ctx.fill();
  });
  requestAnimationFrame(drawDust);
}
if (!reducedMotion) {
  requestAnimationFrame(drawDust);
}

/* ---------- 6. SpeechLens live demo ---------- */
const FILLERS = [
  "um", "uh", "like", "you know", "basically", "actually", "literally",
  "sort of", "kind of", "i mean", "so", "well", "right", "okay", "just"
];
const WPM = 130;

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function analyzeSpeech(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(sentences.length, 1);

  const minutes = wordCount / WPM;
  const mm = Math.floor(minutes);
  const ss = Math.round((minutes - mm) * 60);

  const lower = " " + text.toLowerCase().replace(/[^a-z\s']/g, " ") + " ";
  let fillerCount = 0;
  const found = [];
  FILLERS.forEach((f) => {
    const re = new RegExp("\\b" + f.replace(" ", "\\s+") + "\\b", "g");
    const m = lower.match(re);
    if (m) {
      fillerCount += m.length;
      found.push(f + " (" + m.length + ")");
    }
  });

  let syllables = 0;
  words.forEach((w) => (syllables += countSyllables(w)));
  const flesch =
    206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / wordCount);

  return { wordCount, mm, ss, minutes, fillerCount, found, flesch };
}

const demoInput = document.getElementById("demo-input");
const demoResults = document.getElementById("demo-results");

document.getElementById("demo-sample").addEventListener("click", () => {
  demoInput.value =
    "Ladies and gentlemen, I want to tell you about the day I, um, discovered that " +
    "speaking is actually a skill anyone can learn. You know, when I first stood on a " +
    "stage, my hands were shaking. I was just a schoolboy from Colombo with, like, big " +
    "dreams and no plan. But every great speaker was once a nervous beginner. So I joined " +
    "Toastmasters. I practiced every single week. I failed, I learned, and I grew. Today I " +
    "judge the very contests that once terrified me. If there is one thing I want you to " +
    "remember, it is this: courage is not the absence of fear. It is speaking anyway.";
});

document.getElementById("demo-analyze").addEventListener("click", () => {
  const text = demoInput.value.trim();
  if (text.split(/\s+/).filter(Boolean).length < 10) {
    demoResults.hidden = false;
    document.getElementById("r-verdict").textContent =
      "Give me at least 10 words to work with — even a Table Topics answer is longer than that!";
    return;
  }

  const r = analyzeSpeech(text);

  document.getElementById("r-time").textContent =
    r.mm + "m " + String(r.ss).padStart(2, "0") + "s";

  const windowEl = document.getElementById("r-window");
  if (r.minutes < 5) windowEl.textContent = "UNDER";
  else if (r.minutes > 7) windowEl.textContent = "OVER";
  else windowEl.textContent = "INSIDE";

  document.getElementById("r-fillers").textContent = r.fillerCount;

  const readEl = document.getElementById("r-read");
  if (r.flesch >= 70) readEl.textContent = "EASY";
  else if (r.flesch >= 50) readEl.textContent = "MODERATE";
  else readEl.textContent = "DENSE";

  let verdict;
  if (r.minutes >= 5 && r.minutes <= 7 && r.fillerCount <= 3) {
    verdict =
      "Contest-ready. You're inside the window with clean delivery — I'd score this well.";
  } else if (r.minutes < 5) {
    verdict =
      "Too short for a 5-7 minute contest. In Toastmasters you'd be disqualified before the judges even vote. Add a story.";
  } else if (r.minutes > 7) {
    verdict =
      "Over time — the red light would be on and the timer standing. Cut your weakest paragraph; the speech will get stronger.";
  } else {
    verdict =
      "Timing works, but " + r.fillerCount + " filler words is where good speeches lose. " +
      "Top offenders: " + (r.found.slice(0, 3).join(", ") || "none") + ". Pause instead.";
  }
  document.getElementById("r-verdict").textContent = verdict;

  demoResults.hidden = false;
});
