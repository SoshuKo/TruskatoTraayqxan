// 置換ルールの定義
const replacements = [
  // ①四重音字の置換
  { pattern: /sçļ/g, replacement: "kr" },
  // ②三重音字の置換
  { pattern: /agh/g, replacement: "ā" },
  { pattern: /aģh/g, replacement: "ā" },
  { pattern: /eģh/g, replacement: "ē" },
  { pattern: /ëgh/g, replacement: "ō" },
  { pattern: /iģh/g, replacement: "ī" },
  { pattern: /ïgh/g, replacement: "ū" },
  { pattern: /ogh/g, replacement: "ō" },
  { pattern: /öģh/g, replacement: "ē" },
  { pattern: /ugh/g, replacement: "ū" },
  { pattern: /ügh/g, replacement: "ī" },
  { pattern: /çhļ/g, replacement: "xr" },
  { pattern: /sch/g, replacement: "ch" },
  // ③二重音字の置換
  { pattern: /sp/g, replacement: "p" },
  { pattern: /st/g, replacement: "t" },
  { pattern: /sc/g, replacement: "c" },
  { pattern: /sç/g, replacement: "k" },
  { pattern: /sk/g, replacement: "q" },
  { pattern: /çļ/g, replacement: "xr" },
  { pattern: /ģļ/g, replacement: "gr" },
  { pattern: /çh/g, replacement: "x" },
  // ④一重音字Aの置換
  { pattern: /ü/g, replacement: "i" },
  { pattern: /ï/g, replacement: "u" },
  { pattern: /ö/g, replacement: "e" },
  { pattern: /ë/g, replacement: "o" },
  { pattern: /k/g, replacement: "qx" },
  { pattern: /g/g, replacement: "gh" },
  // ⑤一重音字Bの置換
  { pattern: /ņ/g, replacement: "n" },
  { pattern: /ç/g, replacement: "x" },
  { pattern: /ģ/g, replacement: "g" },
  { pattern: /ļ/g, replacement: "y" },
];

// 変換処理
function transformText(input) {
  let transformed = input;
  const markers = []; // マーカーリスト

  // 置換ルールを順番に適用（既に置換された部分をスキップ）
  replacements.forEach((rule, index) => {
    let match;
    const regex = new RegExp(rule.pattern.source, 'g'); // 全てのマッチを探す

    while ((match = regex.exec(transformed)) !== null) {
      // マッチの開始位置と終了位置を取得
      const start = match.index;
      const end = regex.lastIndex;

      // この範囲が既にマークされていないか確認
      if (!markers.some(marker => marker.start <= start && marker.end >= end)) {
        // 置換を実行
        transformed = transformed.substring(0, start) + rule.replacement + transformed.substring(end);

        // 置換した範囲をマーカーとして保存（元の長さと置換後の長さに注意）
        markers.push({
          start: start,
          end: start + rule.replacement.length,
        });

        // 置換が終わった後はregexのindexをリセット
        regex.lastIndex = start + rule.replacement.length;
      }
    }
  });

  return transformed;
}

// 使用例
const inputText = "入力されたトルスカ語のテキスト";
const outputText = transformText(inputText);
console.log(outputText);
