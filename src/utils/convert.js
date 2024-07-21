import fs from 'fs'

// Reading the file
fs.readFile('./SuffixTree/src/utils/arr1.json', 'utf8', (err, data) => {
  if (err) throw err;
  // Parsing the JSON string into a JavaScript array
  const array = JSON.parse(data);
  for (let i = 0; i < array.length; i++){
    const {nodeClassName, ...temp} = array[i];
    for (let j = 0; j < temp.children.length; j++){
        temp.children[j] = temp.children[j].index;
    };
    array[i] = temp;
  };
  fs.writeFile('./SuffixTree/src/utils/arr1Convert.json', JSON.stringify(array, null, 2), (err) => {
    if (err){
      console.log(err)
    }
  });
});