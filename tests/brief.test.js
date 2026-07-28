import test from "node:test";
import assert from "node:assert/strict";
import { autonomyMeta, buildBrief, lines } from "../brief.js";

test("autonomy is clamped and labeled", () => {
  assert.equal(autonomyMeta(-20).label, "忠実実装");
  assert.equal(autonomyMeta(72).label, "大胆な探索");
  assert.equal(autonomyMeta(999).label, "総取りモード");
});

test("lines removes blanks and trims content", () => {
  assert.deepEqual(lines(" a \n\n・ b\n"), ["a", "・ b"]);
});

test("brief includes purpose, real constraints and challenge mode", () => {
  const brief = buildBrief({
    project: "旅行ページ",
    audience: "友達",
    purpose: "相談を盛り上げる",
    success: "候補を一緒に選べる",
    constraints: "APIなし\n無料",
    preferences: "ベージュ禁止",
    autonomy: 91,
    challenge: true,
  });

  assert.match(brief, /旅行ページ/);
  assert.match(brief, /- APIなし/);
  assert.match(brief, /- 無料/);
  assert.match(brief, /総取りモード/);
  assert.match(brief, /従う前に指摘/);
});

test("brief has useful fallbacks for blank input", () => {
  const brief = buildBrief({ autonomy: 50, challenge: false });
  assert.match(brief, /未定のプロジェクト/);
  assert.match(brief, /現時点では特になし/);
  assert.match(brief, /実装を優先/);
});
