let xlsx = require('xlsx');

let workbook = xlsx.readFile("Book2.xlsx")

let worksheet = workbook.Sheets["Sheet2"]

//console.log(xlsx.utils.sheet_to_json(worksheet), [false])

xlsx.utils.sheet_add_json(worksheet, [{Name: "Jose Cabral", DOB: "12-19-1996", PhoneNumber: 
"6789959821", NumOfAddressWithin3Years: "1", TimeAtCurrentAddress: "Since July 4, 2006" }], 
{skipHeader: true, origin:-1})

xlsx.writeFile(workbook, "Book2.xlsx")