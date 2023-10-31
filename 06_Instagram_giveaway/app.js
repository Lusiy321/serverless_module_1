import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readUsernamesFromFile(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  const usernames = data.trim().split("\n");
  return [...new Set(usernames)];
}

function uniqueValues() {
  const uniqueUsernames = new Set();
  for (let i = 0; i <= 19; i++) {
    const filePath = path.join(__dirname, `words/out${i}.txt`);
    const usernames = readUsernamesFromFile(filePath);
    usernames.forEach((username) => uniqueUsernames.add(username));
  }
  return uniqueUsernames.size;
}

async function existInAllFiles() {
  const filePaths = Array.from({ length: 20 }, (_, i) =>
    path.join(__dirname, `words/out${i}.txt`)
  );

  try {
    const promises = filePaths.map(readUsernamesFromFile);
    const usernamesArrays = await Promise.all(promises);

    if (usernamesArrays.length === 0) {
      return 0;
    }

    const [firstUsernames, ...restUsernames] = usernamesArrays;

    const allUsernames = new Set(firstUsernames);

    for (const usernames of restUsernames) {
      const usernamesSet = new Set(usernames);
      for (const existingUsername of allUsernames) {
        if (!usernamesSet.has(existingUsername)) {
          allUsernames.delete(existingUsername);
        }
      }
    }

    return allUsernames.size;
  } catch (error) {
    console.error(`Error in existInAllFiles: ${error.message}`);
    return 0;
  }
}

function existInAtleastTen() {
  const usernameCountMap = new Map();
  for (let i = 0; i <= 19; i++) {
    const filePath = path.join(__dirname, `words/out${i}.txt`);
    const usernames = readUsernamesFromFile(filePath);
    usernames.forEach((username) => {
      if (usernameCountMap.has(username)) {
        usernameCountMap.set(username, usernameCountMap.get(username) + 1);
      } else {
        usernameCountMap.set(username, 1);
      }
    });
  }
  const countAtleastTen = [...usernameCountMap.values()].filter(
    (count) => count >= 10
  ).length;
  return countAtleastTen;
}

console.time("uniqueValues");
console.log("Уникальные имена во всех файлах:", uniqueValues());
console.timeEnd("uniqueValues");

console.time("existInAllFiles");
console.log("Имена, встречающиеся во всех 20 файлах:", await existInAllFiles());
console.timeEnd("existInAllFiles");

console.time("existInAtleastTen");
console.log(
  "Имена, встречающиеся как минимум в 10 файлах:",
  existInAtleastTen()
);
console.timeEnd("existInAtleastTen");
