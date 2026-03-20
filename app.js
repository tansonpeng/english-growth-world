const worldScreen = document.getElementById("world-screen");
const lessonScreen = document.getElementById("lesson-screen");
const parentPanel = document.getElementById("parent-panel");
const openParentButton = document.getElementById("open-parent");
const closeParentButton = document.getElementById("close-parent");
const toggleVoiceButton = document.getElementById("toggle-voice");
const startLessonButton = document.getElementById("start-lesson");
const backToWorldButton = document.getElementById("back-to-world");
const speakWordButton = document.getElementById("speak-word");
const practiceButton = document.getElementById("practice-btn");
const lessonArt = document.getElementById("lesson-art");
const lessonWord = document.getElementById("lesson-word");
const mapShell = document.getElementById("map-shell");

const lessons = {
  fox: { emoji: "🦊", word: "apple", voice: "apple" },
  bear: { emoji: "🐻", word: "bear", voice: "bear" },
  cat: { emoji: "🐱", word: "cat", voice: "cat" },
  rabbit: { emoji: "🐰", word: "rabbit", voice: "rabbit" }
};

let currentLessonKey = "cat";
let voiceEnabled = true;
let userHasInteracted = false;

function speak(text) {
  if (!voiceEnabled || !userHasInteracted || !("speechSynthesis" in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.88;
  utterance.pitch = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function setActiveNode(key) {
  document.querySelectorAll(".map-node").forEach((button) => {
    button.classList.toggle("active", button.dataset.lesson === key);
  });
}

function renderLesson(key) {
  currentLessonKey = key;
  const lesson = lessons[key] || lessons.cat;
  lessonArt.textContent = lesson.emoji;
  lessonWord.textContent = lesson.word;
  setActiveNode(key);
}

function openLesson(key = currentLessonKey) {
  userHasInteracted = true;
  renderLesson(key);
  worldScreen.classList.add("hidden");
  lessonScreen.classList.remove("hidden");
  lessonScreen.setAttribute("aria-hidden", "false");
}

function closeLesson() {
  lessonScreen.classList.add("hidden");
  lessonScreen.setAttribute("aria-hidden", "true");
  worldScreen.classList.remove("hidden");
}

function openParent() {
  parentPanel.classList.remove("hidden");
  parentPanel.setAttribute("aria-hidden", "false");
}

function closeParent() {
  parentPanel.classList.add("hidden");
  parentPanel.setAttribute("aria-hidden", "true");
}

function updateVoiceButton() {
  toggleVoiceButton.textContent = voiceEnabled ? "🔊" : "🔈";
  toggleVoiceButton.setAttribute("aria-pressed", String(voiceEnabled));
}

document.querySelectorAll(".map-node").forEach((button) => {
  button.addEventListener("click", () => {
    openLesson(button.dataset.lesson);
  });
});

startLessonButton.addEventListener("click", () => openLesson("cat"));
backToWorldButton.addEventListener("click", closeLesson);

speakWordButton.addEventListener("click", () => {
  userHasInteracted = true;
  speak(lessons[currentLessonKey].voice);
});

practiceButton.addEventListener("click", () => {
  userHasInteracted = true;
  speak(lessons[currentLessonKey].voice);
});

toggleVoiceButton.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  updateVoiceButton();
  if (!voiceEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

openParentButton.addEventListener("click", openParent);
closeParentButton.addEventListener("click", closeParent);
parentPanel.addEventListener("click", (event) => {
  if (event.target === parentPanel) {
    closeParent();
  }
});

mapShell.addEventListener("click", () => {
  userHasInteracted = true;
});

updateVoiceButton();
renderLesson(currentLessonKey);
