function sortNumberSmall(arr) {
  const array = [...new Set(arr)];
  const arrIsNumbers = array.every((value) => !isNaN(value));

  if (!arrIsNumbers) {
    console.log("Writed not a numbers. Sorting is not possible.");
    return startProgram();
  } else {
    const result = array.sort((a, b) => a - b);
    console.log("Sorted numbers:", result);
    return startProgram();
  }
}

function sortNumberBig(arr) {
  const array = [...new Set(arr)];
  const arrIsNumbers = array.every((value) => !isNaN(value));

  if (!arrIsNumbers) {
    console.log("Writed not a numbers. Sorting is not possible.");
    return startProgram();
  } else {
    const result = array.sort((a, b) => b - a);
    console.log("Sorted numbers:", result);
    return startProgram();
  }
}

function sortByName(arr) {
  const array = [...new Set(arr)];
  const sort = array.sort();
  console.log("Sorted words: ", sort);
  return startProgram();
}
function sortByQuantity(arr) {
  const array = [...new Set(arr)];
  const sort = array.sort((a, b) => a.length - b.length);
  console.log("Sorted words: ", sort);
  return startProgram();
}

function sortByUnique(arr) {
  const array = [...new Set(arr)];
  const sort = array.sort((a, b) => a - b);
  console.log("Sorted words: ", sort);
  return startProgram();
}

function sortArr(value) {
  process.stdin.once("data", (input) => {
    const inputValue = input.toString().trim();
    if (inputValue === "exit") {
      process.stdin.pause();
    } else {
      if (inputValue === "1") {
        sortByName(value);
        return;
      }
      if (inputValue === "2") {
        sortNumberSmall(value);
        return;
      }

      if (inputValue === "3") {
        sortNumberBig(value);
        return;
      }
      if (inputValue === "4") {
        sortByQuantity(value);
        return;
      }

      if (inputValue === "5") {
        sortByUnique(value);
        return;
      }
      return console.log("You are Enter wrong number");
    }
  });
}

function startProgram() {
  console.log(
    "Hello! Enter 10 words or digits deviding them in spaces: mango polly apple girl some true great 45 56 nice"
  );
  process.stdin.once("data", (input) => {
    const inputValue = input.toString().trim();
    if (inputValue === "exit") {
      process.stdin.pause();
    } else {
      const arrWords = inputValue.split(" ");
      if (arrWords.length <= 9) {
        console.log(
          `Please enter 10 words or digits. You are enter ${arrWords.length} words or digits`
        );
        return startProgram();
      }

      if (arrWords.length >= 10) {
        console.log(`How would you like to sort values:
      1. Words by name (from A to Z).
      2. Show digits from the smallest.
      3. Show digits from the bigest.
      4. Words by quantity of leters.
      5. Only unique words.

      Select (1 - 5) and press enter: `);
        sortArr(arrWords);
      }
    }
  });
}
startProgram();
