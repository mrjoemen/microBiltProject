// const ExcelJS = require('exceljs');

// let workbook = new ExcelJS.Workbook()

// async function addIntoToSheet(firstName) {
//     let wb = await workbook.xlsx.readFile('worksheetForFetch.xlsx');
//     let ws = wb.getWorksheet(1);
  

//     ws.getCell(`B${ws.rowCount + 1}`).value = firstName;
//     await workbook.xlsx.writeFile('worksheetForFetch.xlsx');
//     console.log('First name added!');

//     ws.
// }

// addIntoToSheet("Mary")

let today = new Date().getFullYear()

console.log(today)