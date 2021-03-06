let databody = '';

//remove extra space
function trimData(x) {
  return x.replace(/^\s+|\s+$/gm, '');
}

//fecth data from titles.txt
fetch('Titles.txt')
  .then((response) => response.text())
  .then((data) => {
    // Do something with your data
    let results = data.split(/\r?\n/);
    let arrayOne = results.shift();
    let array = localStorage.setItem('arrayOne', JSON.stringify(results));
  });

//fecth data from sources.txt
fetch('Source Files.txt')
  .then((response) => response.text())
  .then((data) => {
    // Do something with your data
    let results = data.split(/\r?\n/);
    let arrayTwo = results.shift();
    let array = localStorage.setItem('arrayTwo', JSON.stringify(results));
  });

// stored data in local storage and also trimmed the aource file of white spaces.
let titleArray = JSON.parse(localStorage.getItem('arrayOne'));
let sourceFileArray = JSON.parse(localStorage.getItem('arrayTwo'));
let newDataa = sourceFileArray.map((val) => {
  let item = trimData(val);
  return item;
});

//created empty arrays
let fuzzyData = [],
  titleData = [],
  sourceFileData = [];

//matching title.txt with sourceFile.txt  and updatig local storage
newDataa.forEach((element) => {
  titleArray.forEach((val) => {
    if (val == element) {
      fuzzyData.push({
        title: val,
        body: element,
      });
    }
  });
});
localStorage.setItem('filteredData', JSON.stringify(fuzzyData));

// sourceFileArray.forEach((item) => {
//     fuzzyData.forEach((val) => {
//         if (val.body !== item) {
//             titleData.push(item)
//         }
//     })

// })

// let dataa = titleData.filter((item, index) => {
//     return titleData.indexOf(item) == index
// })

// creating auto match function
const fuzzyMatch = () => {
  let tableContent = '';
  let data = JSON.parse(localStorage.getItem('filteredData'));

  //create tbody with data
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let row = `<tr>
                                <td  class="text-center">${i + 1}</td>
                                <td class="text-center"><input type="checkbox" class="form-check-input" ></td>
                                <td>${item.title}</td>
                                <td>${item.body}</td>
                                <td><button class="btn btn-primary">Downgrade</button></td>
                            </tr>`;

    tableContent += row;
  }

  //append data to table
  $('#fuzzyTable > tbody').append(tableContent);

  //initialize datatable
  $('#fuzzyTable').DataTable();
};

fuzzyMatch();

//SECTION 2
// creating manual option
const titleSelect = document.querySelector('#title'),
  sourceFile = document.querySelector('#source-file'),
  btnUgrade = document.querySelector('#btn-ugrade');

//load title options
titleSelect.innerHTML += titleArray
  .map((item, index) => {
    let data = `<option value="${index + 1}">${item}</option>`;
    return data;
  })
  .join();

//load Source file options
sourceFile.innerHTML += sourceFileArray
  .map((item, index) => {
    let data = `<option value="${index + 1}">${item}</option>`;
    return data;
  })
  .join();

const manualMatch = () => {
  let manualData = {
    title: titleSelect.options[titleSelect.selectedIndex].text,
    body: sourceFile.options[sourceFile.selectedIndex].text,
  };
  let data = JSON.parse(localStorage.getItem('filteredData'));
  data.push(manualData);
  localStorage.setItem('filteredData', JSON.stringify(data));
  // $('#fuzzyTable ').clear().destroy();
  $('#fuzzyTable tbody').empty();
  $('#fuzzyTable').DataTable();
  fuzzyMatch();
};

//ugrade title on click
btnUgrade.addEventListener('click', manualMatch);
