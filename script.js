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
  { pattern: /sch/g, replacement: "ch#" },
  // ③二重音字の置換
  { pattern: /sp/g, replacement: "p#" },
  { pattern: /st/g, replacement: "t#" },
  { pattern: /sc/g, replacement: "c#" },
  { pattern: /sç/g, replacement: "k#" },
  { pattern: /sk/g, replacement: "q#" },
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

// 追加の置換ルールの定義
const additionalReplacements = [
  // 語尾の置換
  { pattern: /b$/, replacement: "p" },
  { pattern: /v$/, replacement: "f" },
  { pattern: /^v/, replacement: "f" },
  { pattern: /^f/, replacement: "'" },
  { pattern: /f$/, replacement: "" }, // 語尾のfを削除
  { pattern: /d$/, replacement: "t" },
  { pattern: /c$/, replacement: "s" },
  { pattern: /^z/, replacement: "s" },
  { pattern: /z$/, replacement: "s" },
  { pattern: /ch$/, replacement: "sh" },
  { pattern: /^j/, replacement: "sh" },
  { pattern: /j$/, replacement: "sh" },
  { pattern: /g$/, replacement: "k" },
  { pattern: /qx$/, replacement: "q" },
  { pattern: /^gh/, replacement: "x" },
  { pattern: /gh$/, replacement: "x" },
  { pattern: /^x/, replacement: "'" },
  { pattern: /x$/, replacement: "" },  // 語尾のxを削除
];

// 母音の置換
const vowelsMap = {
  a: 'ā',
  e: 'ē',
  i: 'ī',
  o: 'ō',
  u: 'ū',
};

// 置換処理（追加のルール適用）
function applyAdditionalReplacements(word) {
  let transformed = word;

  // 追加の置換ルールを適用
  additionalReplacements.forEach(rule => {
    transformed = transformed.replace(rule.pattern, rule.replacement);
  });

  // ā, ē, ī, ō, ūが含まれていない場合の母音置換
  if (!/[āēīōū]/.test(transformed)) {
    // 最後に出現する母音（a, e, i, o, u）を置換
    const lastVowelMatch = transformed.match(/[aeiou](?!.*[aeiou])/);
    if (lastVowelMatch) {
      const lastVowel = lastVowelMatch[0];
      transformed = transformed.replace(lastVowel, vowelsMap[lastVowel]);
    }
  }

  return transformed;
}

// 全体の変換処理
function transformText(input) {
  let transformed = input;
  const markers = []; // マーカーリスト

  // ①～⑤の置換を適用
  replacements.forEach((rule, index) => {
    let match;
    const regex = new RegExp(rule.pattern.source, 'g'); // 全てのマッチを探す

    while ((match = regex.exec(transformed)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;

      if (!markers.some(marker => marker.start <= start && marker.end >= end)) {
        transformed = transformed.substring(0, start) + rule.replacement + transformed.substring(end);
        markers.push({
          start: start,
          end: start + rule.replacement.length,
        });
        regex.lastIndex = start + rule.replacement.length;
      }
    }
  });

  // 追加の置換を適用
  transformed = applyAdditionalReplacements(transformed);

  // 最後に # を削除（⑦）
  transformed = transformed.replace(/#/g, "");

  return transformed;
}

// 複数単語の変換処理
function transformMultipleWords(input) {
  const words = input.split(/\s+/);
  const transformedWords = words.map(word => transformText(word));
  return transformedWords.join('\n');
}

// 使用例
const inputText = "複数のトルスカ語の単語を入力してください";
const outputText = transformMultipleWords(inputText);
console.log(outputText);
