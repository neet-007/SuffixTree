import fs from 'fs'
const ALPHABET = [
    '$', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

function sortChars(s, alphabet){
    const order = Array(s.length).fill(-1);
    const count = Array(alphabet.length).fill(0);

    for (let i = 0; i < s.length; i ++){
        count[alphabet.indexOf(s[i].toLowerCase())] += 1;
    };

    for (let j = 1; j < count.length; j ++){
        count[j] += count[j - 1];
    };

    for (let i = s.length - 1; i >= 0; i --){
        count[alphabet.indexOf(s[i].toLowerCase())] -= 1;
        order[count[alphabet.indexOf(s[i].toLowerCase())]] = i;
    };

    return order;
};

function computeClasses(s, order){
    const classes = Array(order.length).fill(0);

    for (let i = 1; i < s.length; i ++){
        if (s[order[i]] !== s[order[i - 1]]){
            classes[order[i]] = classes[order[i - 1]] + 1;
        }else{
            classes[order[i]] = classes[order[i - 1]];
        };
    };

    return classes;
};

function sortingDoubles(s, l, order, classes){
    const newOrder = Array(s.length).fill(0);
    const count = Array(s.length).fill(0);

    for (let i = 0; i < s.length; i ++){
        count[classes[i]] += 1;
    };

    for (let j = 1; j < s.length; j ++){
        count[j] += count[j - 1];
    };

    for (let i = s.length - 1; i >= 0; i --){
        const start = (order[i] - l + s.length) % s.length;
        const cl = classes[start];
        count[cl] -= 1;
        newOrder[count[cl]] = start;
    };

    return newOrder;
};

function updateClasses(s, l, newOrder, classes){
    const newClasses = Array(s.length).fill(0);

    for (let i = 1; i < s.length; i ++){
        const curr = newOrder[i];
        const prev = newOrder[i - 1];
        const currMid = (curr + l) % s.length;
        const prevMid = (prev + l) % s.length;

        if (classes[curr] !== classes[prev] || classes[currMid] !== classes[prevMid]){
            newClasses[curr] = newClasses[prev] + 1;
        }else{
            newClasses[curr] = newClasses[prev];
        };
    };
    return newClasses;
};

function buildSuffixArray(s){
    let order = sortChars(s, ALPHABET);
    let classes = computeClasses(s, order);
    let l = 1;

    while (l < s.length){
        order = sortingDoubles(s, l, order, classes);
        classes = updateClasses(s, l, order, classes);
        l *= 2;
    };

    return order;
};

function compareLCP(s, i, j, lcp){
    let lcp_ = Math.max(0, lcp);
    while (i + lcp_ < s.length && j + lcp_ < s.length){
        if (s[i + lcp_] === s[j + lcp_]){
            lcp_ += 1;
        }else{
            break;
        };
    };

    return lcp_;
};



function computeLCPArray(s, suffixArray){
    const inverseSuffixArray = Array(suffixArray.length).fill(0);
    const lcpArray = Array(suffixArray.length - 1).fill(0);

    for (let i = 0; i < inverseSuffixArray.length; i++){
        inverseSuffixArray[suffixArray[i]] = i;
    };

    let lcp = 0;

    let suffix = suffixArray[0];
    for (let i = 0; i < s.length; i++){
        const currIndex = inverseSuffixArray[suffix];
        if (currIndex === s.length - 1){
            lcp = 0;
            suffix = (suffix + 1) % s.length;
            continue;
        };
        const nextSuffix = suffixArray[currIndex + 1];
        lcp = compareLCP(s, suffix, nextSuffix, lcp - 1);
        lcpArray[currIndex] = lcp;
        suffix = (suffix + 1) % s.length;
    };

    return lcpArray
};

function createLeafNode(s, node, nodeIdx, suffix){
    return {
        parent:nodeIdx,
        stringDepth:s.length - suffix,
        edgeStart:suffix + node.stringDepth,
        edgeEnd:s.length - 1,
        children:Array(ALPHABET.length).fill(-1)
    };
};

function breakeNode(node, nodeIdx, start, offset){
    return {
        parent:nodeIdx,
        stringDepth:node.stringDepth + offset,
        edgeStart: start,
        edgeEnd: start + offset - 1,
        children:Array(ALPHABET.length).fill(-1)
    };
};

function buildSuffixTree(s, suffixArray, lcpArray){
    const suffixTree = [];
    suffixTree.push({parent:-1, stringDepth:0, edgeStart:-1, edgeEnd:-1, children:Array(ALPHABET.length).fill(-1)});

    let currNode = suffixTree[0];
    let currIndex = 0;
    let lcpPrev = 0;

    for (let i = 0; i < s.length; i++){
        const suffix = suffixArray[i];

        while (currNode.stringDepth > lcpPrev){
            currIndex = currNode.parent;
            currNode = suffixTree[currIndex];
        };

        if (currNode.stringDepth === lcpPrev){
            currNode = createLeafNode(s, currNode, currIndex, suffix);
            suffixTree[currIndex].children[ALPHABET.indexOf(s[currNode.edgeStart].toLowerCase())] = suffixTree.length;
            currIndex = suffixTree.length;
            suffixTree.push(currNode);
        }else{
            const start = suffixArray[i - 1] + currNode.stringDepth;
            const offset = lcpPrev - currNode.stringDepth;
            const midNode = breakeNode(currNode, currIndex, start, offset);

            midNode.children[ALPHABET.indexOf(s[start + offset].toLowerCase())] = currNode.children[ALPHABET.indexOf(s[start].toLowerCase())];
            suffixTree[suffixTree[currIndex].children[ALPHABET.indexOf(s[start].toLowerCase())]].parent = suffixTree.length;
            suffixTree[suffixTree[currIndex].children[ALPHABET.indexOf(s[start].toLowerCase())]].edgeStart += offset;

            suffixTree[currIndex].children[ALPHABET.indexOf(s[start].toLowerCase())] = suffixTree.length;
            currIndex = suffixTree.length;
            suffixTree.push(midNode);

            currNode = createLeafNode(s, midNode, currIndex, suffix);
            suffixTree[currIndex].children[ALPHABET.indexOf(s[currNode.edgeStart].toLowerCase())] = suffixTree.length;

            currIndex = suffixTree.length;
            suffixTree.push(currNode);
        };
        if (i < s.length - 1){
            lcpPrev = lcpArray[i];
        };
    };

    return suffixTree
};

const s = 'dddddddddddd$';
const suffixArray = buildSuffixArray(s);
console.log(suffixArray)
const lcpArray = computeLCPArray(s, suffixArray);
console.log(lcpArray)
const suffixTree = buildSuffixTree(s, suffixArray, lcpArray);
console.log(suffixTree.length)
/*
fs.writeFile('./SuffixTree/src/utils/arr2.json', JSON.stringify(suffixTree), (err) => {
    if (err){
        console.log(err);
    };
});
*/
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
    if (arr1.length !== arr2.length) {
      console.log(`Difference in array lengths: ${arr1.length} !== ${arr2.length}`);
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (!deepEqualWithDiff(arr1[i], arr2[i], `array[${i}]`)) return false;
    }
    return true;
  }

//console.log(arraysEqualWithDiff(arr1, arr2))
/*
function traverse(node){
    if (node.edgeStart !== -1){
        console.log(s.slice(node.edgeStart, node.edgeEnd + 1));
    };
    for (let i = 0; i < node.children.length; i++){
        if (node.children[i] !== -1){
            traverse(suffixTree[node.children[i]]);
        };
    };
}
*/
//traverse(suffixTree[0])

/*
for (let i = 1; i < suffixTree.length; i++){
    console.log(s.slice(suffixTree[i].edgeStart, suffixTree[i].edgeEnd + 1));
};
*/