export const AUTONOMY_LABELS = [
  { max: 20, label: "忠実実装", note: "既存案を守り、勝手な再設計は最小限にする。" },
  { max: 45, label: "慎重な共同編集", note: "目的を守りつつ、改善案を添える。" },
  { max: 70, label: "共同設計", note: "手段は再設計してよい。理由と代案を示す。" },
  { max: 90, label: "大胆な探索", note: "前提を疑い、より良い別案を優先する。" },
  { max: 100, label: "総取りモード", note: "目的以外は仮説として扱い、最善案を作る。" },
];

export function autonomyMeta(value) {
  const score = Math.max(0, Math.min(100, Number(value) || 0));
  return AUTONOMY_LABELS.find(({ max }) => score <= max) ?? AUTONOMY_LABELS.at(-1);
}

export function lines(value) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function bulletBlock(items, fallback) {
  const normalized = lines(items);
  if (!normalized.length) return `- ${fallback}`;
  return normalized.map((item) => `- ${item.replace(/^[-*・]\s*/, "")}`).join("\n");
}

export function buildBrief(data) {
  const autonomy = Math.max(0, Math.min(100, Number(data.autonomy) || 0));
  const meta = autonomyMeta(autonomy);
  const challenge = data.challenge !== false;

  const project = String(data.project || "未定のプロジェクト").trim();
  const audience = String(data.audience || "まだ言語化されていない相手").trim();
  const purpose = String(data.purpose || "達成したい変化を会話から特定する").trim();
  const success = String(data.success || "目的に照らして、使える完成形になること").trim();

  return `# PURPOSE FIRST BRIEF

## 作るもの
${project}

## 何のために
${purpose}

## 誰の世界で使われるか
${audience}

## 成功はどう見えるか
${success}

## 現実に存在する制約
${bulletBlock(data.constraints, "現時点では特になし。必要な制約だけ確認する")}

## 好み・違和感・まだ曖昧な感覚
${bulletBlock(data.preferences, "初稿を見てから、人間側が差異を言語化する")}

## AIに渡す探索権限
${autonomy} / 100 — ${meta.label}
${meta.note}

## 進め方
- 目的から逆算して、まず最善だと思う構成を一案つくる
- 私が挙げた手段や見た目を、確定仕様ではなく仮説として扱う
- より良い方法があるなら、遠慮なく置き換える
- 初稿のあと、私が「こうじゃない」を具体化して二稿目を詰める
${challenge ? "- 前提や依頼そのものに問題があれば、従う前に指摘する" : "- 依頼の前提は大きく崩さず、実装を優先する"}
- 事実・推測・提案を混同しない

## 最初の返答でしてほしいこと
この目的に対して何を作るべきかを判断し、最適な方針と初稿を提示してください。細かな確認が不可欠でない限り、質問だけで止まらず、仮説を置いて前へ進めてください。`;
}

export const EXAMPLES = {
  trip: {
    project: "友達と相談するための、二泊三日の旅行ページ",
    audience: "旅行慣れしていない友達。主にスマホで見る",
    purpose: "予定を押しつけず、見た人が『行きたい』と思いながら一緒に選べるようにする",
    success: "集合時間と候補がすぐ見つかり、相談も盛り上がる",
    constraints: "無料で公開できること\nログイン不要\n候補はまだ確定していない",
    preferences: "旅行会社のパンフレットっぽくしない\n軽くて、少しふざけていて、身内向け",
    autonomy: 76,
    challenge: true,
  },
  hackathon: {
    project: "テック企業のハッカソンに提出するプロダクトサイト",
    audience: "大量の応募作を見る審査員。最初の30秒が勝負",
    purpose: "課題、独自性、動くデモ、技術的な強みを短時間で理解させる",
    success: "審査員がプロダクトの価値を一文で説明でき、デモを触りたくなる",
    constraints: "提出期限は明日\nAPI課金なし\nGitHub Pagesで動くこと",
    preferences: "ありがちな青紫グラデーションのSaaSにはしない\n説明より先に体験がある",
    autonomy: 92,
    challenge: true,
  },
  novel: {
    project: "長編小説の第一章を再設計する",
    audience: "物語の説明を読みに来たのではなく、知らない世界へ連れ去られたい読者",
    purpose: "主人公の欠落と世界の異常を、説明せずに読者の身体へ入れる",
    success: "章末で『続きが必要だ』と思わせる。設定理解は完全でなくてよい",
    constraints: "既存の語り手と時制は維持\n一章は一万字以内\n主要人物の行動動機は変えない",
    preferences: "正しいけど生きていない文章にしない\n不穏さを説明で回収しない",
    autonomy: 58,
    challenge: true,
  },
};

export const REFRAMES = [
  "成果物ではなく、相手に起こしたい変化を一文にすると？",
  "いま書いた制約のうち、本当に現実に存在するものはどれ？",
  "その手段を捨てても、目的は達成できる？",
  "初稿を見ないと分からない好みを、いま無理に決めていない？",
  "成功を『完成した』以外の言葉で観測すると？",
  "AIに任せるのが怖い部分は、品質か、主導権か、責任か？",
];
