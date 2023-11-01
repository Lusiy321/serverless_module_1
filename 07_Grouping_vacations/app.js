import fs from "node:fs";

const readFile = fs.readFileSync("data.json", "utf8");
const data = JSON.parse(readFile);

const sortData = data.reduce((acc, entry) => {
  const userId = entry.user._id;
  const userName = entry.user.name;

  if (!acc[userId]) {
    acc[userId] = { userId, userName, Vacations: [] };
  }

  acc[userId].Vacations.push({
    startDate: entry.startDate,
    endDate: entry.endDate,
  });

  return acc;
}, {});

const sortedData = Object.values(sortData);

fs.writeFile("sorted.json", JSON.stringify(sortedData, null, 2), (e) => {
  if (e) {
    console.error("Error to write file");
  } else {
    return;
  }
});

console.log(JSON.stringify(sortedData, null, 2));
