import fs from 'fs';

// Function to compare arrays
function arraysEqualWithDiffa(arr1, arr2) {
    // Implement your array comparison logic here
    // For example, checking if they have the same elements
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}

async function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

async function main() {
    try {
        // Read both files asynchronously
        const arr1 = await readFileAsync('./SuffixTree/src/utils/arr1Convert.json');
        const arr2 = await readFileAsync('./SuffixTree/src/utils/arr2.json');
        // Now arr1 and arr2 are populated, you can compare them
        console.log(arraysEqualWithDiffa(arr1, arr2));
    } catch (err) {
        console.error('Error reading files:', err);
    }
}

// Call the main function to start the process
main();
function deepEqualWithDiff(obj1, obj2, path = "") {
    if (obj1 === obj2) return true;
  
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      console.log(`Difference at ${path}: ${obj1} !== ${obj2}`);
      return false;
    }
  
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      console.log(`Difference at ${path}: keys length mismatch ${keys1.length} !== ${keys2.length}`);
      return false;
    }
  
    for (let key of keys1) {
      if (!keys2.includes(key)) {
        console.log(`Difference at ${path}: key ${key} not found in second object`);
        return false;
      }
      if (!deepEqualWithDiff(obj1[key], obj2[key], `${path}.${key}`)) return false;
    }
  
    return true;
  }
  
  function arraysEqualWithDiff(arr1, arr2) {
    console.log(arr1)
    console.log(arr2)
    if (arr1.length !== arr2.length) {
      console.log(`Difference in array lengths: ${arr1.length} !== ${arr2.length}`);
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (!deepEqualWithDiff(arr1[i], arr2[i], `array[${i}]`)) return false;
    }
    return true;
  }
