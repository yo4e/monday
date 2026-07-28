import { buildBrief, EXAMPLES, REFRAMES, autonomyMeta } from "./brief.js";

const STORAGE_KEY = "monday-purpose-first-v1";
const form = document.querySelector("#brief-form");
const output = document.querySelector("#brief-output");
const status = document.querySelector("#status");
const autonomy = document.querySelector("#autonomy");
const autonomyValue = document.querySelector("#autonomy-value");
const autonomyLabel = document.querySelector("#autonomy-label");
const reframe = document.querySelector("#reframe-text");
const copyButton = document.querySelector("#copy-brief");
const downloadButton = document.querySelector("#download-brief");

function formData() {
  const data = new FormData(form);
  return {
    project: data.get("project"),
    audience: data.get("audience"),
    purpose: data.get("purpose"),
    success: data.get("success"),
    constraints: data.get("constraints"),
    preferences: data.get("preferences"),
    autonomy: data.get("autonomy"),
    challenge: data.get("challenge") === "on",
  };
}

function fillForm(data) {
  for (const [key, value] of Object.entries(data)) {
    const field = form.elements.namedItem(key);
    if (!field) continue;
    if (field.type === "checkbox") field.checked = Boolean(value);
    else field.value = value;
  }
  updateAutonomy();
  render();
}

function updateAutonomy() {
  const value = Number(autonomy.value);
  const meta = autonomyMeta(value);
  autonomyValue.textContent = String(value);
  autonomyLabel.textContent = `${meta.label} — ${meta.note}`;
  autonomy.style.setProperty("--range", `${value}%`);
}

function render({ announce = false } = {}) {
  const data = formData();
  output.textContent = buildBrief(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (announce) say("ブリーフを更新しました。初稿を見せる準備はできています。");
}

function say(message) {
  status.textContent = message;
}

async function copyBrief() {
  try {
    await navigator.clipboard.writeText(output.textContent);
    say("ブリーフをクリップボードへコピーしました。");
    copyButton.textContent = "コピー済み";
    setTimeout(() => (copyButton.textContent = "コピー"), 1400);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(output);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    say("本文を選択しました。コピーしてください。");
  }
}

function downloadBrief() {
  const blob = new Blob([output.textContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "purpose-first-brief.txt";
  link.click();
  URL.revokeObjectURL(url);
  say("テキストファイルを保存しました。");
}

function randomReframe() {
  const current = reframe.textContent;
  const choices = REFRAMES.filter((item) => item !== current);
  reframe.textContent = choices[Math.floor(Math.random() * choices.length)];
}

form.addEventListener("input", (event) => {
  if (event.target === autonomy) updateAutonomy();
  render();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render({ announce: true });
  output.closest(".output-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

copyButton.addEventListener("click", copyBrief);
downloadButton.addEventListener("click", downloadBrief);
document.querySelector("#reframe-button").addEventListener("click", randomReframe);

document.querySelector("#reset-brief").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  autonomy.value = "72";
  updateAutonomy();
  render();
  say("入力を初期化しました。白紙は命令ではなく、探索の入口です。");
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    fillForm(EXAMPLES[button.dataset.example]);
    say(`${button.textContent.trim()}の例を読み込みました。`);
  });
});

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    fillForm(JSON.parse(saved));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

if (!saved) {
  updateAutonomy();
  render();
}

randomReframe();
