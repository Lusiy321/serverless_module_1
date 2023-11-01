import axios from "axios";

const endpoint = [
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-955",
  "https://jsonbase.com/sls-team/json-231",
  "https://jsonbase.com/sls-team/json-931",
  "https://jsonbase.com/sls-team/json-93",
  "https://jsonbase.com/sls-team/json-342",
  "https://jsonbase.com/sls-team/json-770",
  "https://jsonbase.com/sls-team/json-491",
  "https://jsonbase.com/sls-team/json-281",
  "https://jsonbase.com/sls-team/json-718",
  "https://jsonbase.com/sls-team/json-310",
  "https://jsonbase.com/sls-team/json-806",
  "https://jsonbase.com/sls-team/json-469",
  "https://jsonbase.com/sls-team/json-258",
  "https://jsonbase.com/sls-team/json-516",
  "https://jsonbase.com/sls-team/json-79",
  "https://jsonbase.com/sls-team/json-706",
  "https://jsonbase.com/sls-team/json-521",
  "https://jsonbase.com/sls-team/json-350",
  "https://jsonbase.com/sls-team/json-64",
];

async function fetch(url) {
  let res;
  for (let i = 0; i < 3; i++) {
    try {
      res = await axios.get(url);
      if (res.data && res.data.isDone !== undefined) {
        return { success: true, data: res.data };
      }
    } catch (error) {
      console.error(`[Error] ${url}: ${error.message}`);
    }
  }
  return { success: false };
}

async function start() {
  const results = { successCount: 0, failCount: 0 };
  const doneCount = { true: 0, false: 0 };

  for (const url of endpoint) {
    const { success, data } = await fetch(url);

    if (success) {
      console.log(`[Success] ${url}: isDone - ${data.isDone}`);
      results.successCount++;
      doneCount[data.isDone ? "true" : "false"]++;
    } else {
      console.error(`[Fail] ${url}: The endpoint is unavailable`);
      results.failCount++;
    }
  }

  console.log(`Found True values: ${doneCount.true}`);
  console.log(`Found False values: ${doneCount.false}`);
}

start();
