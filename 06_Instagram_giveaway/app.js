import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readFile(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  const words = data.trim().split("\n");
  return [...new Set(words)];
}

function uniqueValues() {
  const uniqueWords = new Set();
  for (let i = 0; i <= 19; i++) {
    const filePath = path.join(__dirname, `words/out${i}.txt`);
    const words = readFile(filePath);
    words.forEach((word) => uniqueWords.add(word));
  }
  return uniqueWords.size;
}

async function existInAllFiles() {
  const filePaths = Array.from({ length: 20 }, (_, i) =>
    path.join(__dirname, `words/out${i}.txt`)
  );

  try {
    const promises = filePaths.map(readFile);
    const wordsArrays = await Promise.all(promises);

    if (wordsArrays.length === 0) {
      return 0;
    }

    const [firstWords, ...restWords] = wordsArrays;

    const allWords = new Set(firstWords);

    for (const words of restWords) {
      const wordsSet = new Set(words);
      for (const existingWords of allWords) {
        if (!wordsSet.has(existingWords)) {
          allWords.delete(existingWords);
        }
      }
    }

    return allWords.size;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 0;
  }
}

function existInAtleastTen() {
  const wordsMap = new Map();
  for (let i = 0; i <= 19; i++) {
    const filePath = path.join(__dirname, `words/out${i}.txt`);
    const words = readFile(filePath);
    words.forEach((word) => {
      if (wordsMap.has(word)) {
        wordsMap.set(word, wordsMap.get(word) + 1);
      } else {
        wordsMap.set(word, 1);
      }
    });
  }
  const countAtleastTen = [...wordsMap.values()].filter(
    (count) => count >= 10
  ).length;
  return countAtleastTen;
}

console.time("uniqueValues");
console.log("Unique names of all files:", uniqueValues());
console.timeEnd("uniqueValues");

console.time("existInAllFiles");
console.log("All exist names of 20 files:", await existInAllFiles());
console.timeEnd("existInAllFiles");

console.time("existInAtleastTen");
console.log("Names in at least 10 files:", existInAtleastTen());
console.timeEnd("existInAtleastTen");
