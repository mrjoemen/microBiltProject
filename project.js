const fetch = require("node-fetch")
const token = "QDjbgkLZghkIYe3sNWFp5Eg08xvP"
const prompt = require('prompt-sync')({sigint: true});
const xlsx = require('xlsx');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const rls = require('readline-sync')
const header = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
    "Accept": "application/json"
}

let workbook = xlsx.readFile("Book2.xlsx") //this gets access to the workbook

let worksheet = workbook.Sheets["Sheet4"] //access to the worksheet, update these accordingly 
// let rowToInsert = new Object()
let rowToInsert = {Name: null, DOB: null, PhoneNumbers: null, NumOfAddressWithin3Years: null, TimeAtCurrentAddress: null}

getInformation = function(firstName, midName, lastName, addr, city, state, zip, num) {
    fetch("https://api.microbilt.com/EnhancedPeopleSearch/GetReport", {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            "PersonInfo": {
                "PersonName": {
                  "FirstName": firstName,
                  "MiddleName": midName,
                  "LastName": lastName
                },
                "ContactInfo": [
                  {
                    "PostAddr": {
                        "Addr1": addr,
                      "City": city,
                      "StateProv": state,
                      "PostalCode": zip
                    }
                  }
                ]
              }
        })
        
    })
    .then(res => res.json())
    .then(res => {
        let address = res.Subject[0].PersonInfo.ContactInfo
        let birthDay = new Date(res.Subject[0].PersonInfo.BirthDt)
        let count = 0
        let now = new Date();

        for (let i = 0; i < address.length; i++) {
            if (address[i].hasOwnProperty('PostAddr')) { // return address
                count++;
                let registeredAddress = `${address[i].PostAddr.StreetNum} ${address[i].PostAddr.StreetName} ${address[i].PostAddr.StreetType}`

                if (now.getFullYear() - new Date(address[i].PostAddr.AddrCreatedDt).getFullYear() >= 3 && addr.toUpperCase().includes(registeredAddress) && i > 0) { //if the address is not their current home (Othewise if it's second on the list or so on)
                  let fromMonthsBeenThere = new Date(address[i].PostAddr.AddrCreatedDt)
                  let toMonthsBeenThere = new Date(address[i-1].PostAddr.AddrCreatedDt)

                  console.log(`At ${addr.toUpperCase()} from ${fromMonthsBeenThere.toString()} to ${toMonthsBeenThere.toString()}`)
                  rowToInsert.TimeAtCurrentAddress = `At ${addr.toUpperCase()} from ${fromMonthsBeenThere.toString()} to ${toMonthsBeenThere.toString()}`

                }
                else if (addr.toUpperCase().includes(registeredAddress) && i === 0) { //this checks how long they've been at their current address
                  let fromMonthsBeenThere = new Date(address[0].PostAddr.AddrCreatedDt)

                  console.log(`At ${addr.toUpperCase()} since ${fromMonthsBeenThere}`)

                  rowToInsert.TimeAtCurrentAddress = `At ${addr.toUpperCase()} since ${fromMonthsBeenThere}`

                }
                rowToInsert.NumOfAddressWithin3Years = count // return number of unique addresses
                console.log("NumOfAddressWithin3Years: " + count)
            }

            if (address[i].hasOwnProperty('PhoneNum')) { //return phone numbers
              rowToInsert.PhoneNumbers  = address[i].PhoneNum.Phone + ", "
              console.log('PhoneNumbers: ' + address[i].PhoneNum.Phone + ", ")
           }

        }

        rowToInsert.DOB = birthDay //return birthday
        rowToInsert.Name = firstName + " " + lastName  //return name
        console.log("DOB: " + birthDay)
    })
    .catch(err => {
      console.log("Information not found or typed incorrectly... try again")
      rl.close()
    })

      // if (rls.keyInYN("display addresses?")) {
      //   displayAddresses(firstName, lastName, addr, city, state, zip, num)
      // }
      rl.close()

}

displayAddresses = function(firstName, lastName, addr, city, state, zip, num) {
  fetch("https://api.microbilt.com/EnhancedPeopleSearch/GetReport", {
      method: "POST",
      headers: header,
      body: JSON.stringify({
          "PersonInfo": {
              "PersonName": {
                "FirstName": firstName,
                "LastName": lastName
              },
              "ContactInfo": [
                {
                  "PostAddr": {
                      "Addr1": addr,
                    "City": city,
                    "StateProv": state,
                    "PostalCode": zip
                  }
                }
              ]
            }
      })
      
  })
  .then(res => res.json())
  .then(res => {
      let Info = res.Subject[0].PersonInfo.ContactInfo

      for (let i = 0; i < Info.length; i++) {
          if (Info[i].hasOwnProperty('PostAddr')) {
            if (Info[i].PostAddr.hasOwnProperty("PreDirection") && Info[i].PostAddr.hasOwnProperty("PostDirection") && Info[i].PostAddr.hasOwnProperty("Apt")){
              console.log(`${Info[i].PostAddr.StreetNum} ${Info[i].PostAddr.PreDirection} ${Info[i].PostAddr.StreetName} ${Info[i].PostAddr.StreetType} ${Info[i].PostAddr.PostDirection} APT ${Info[i].PostAddr.Apt} - ${Info[i].PostAddr.City}, ${Info[i].PostAddr.StateProv}, ${Info[i].PostAddr.PostalCode}`)
          }
          else if (Info[i].PostAddr.hasOwnProperty("PreDirection") && Info[i].PostAddr.hasOwnProperty("PostDirection")) {
            console.log(`${Info[i].PostAddr.StreetNum} ${Info[i].PostAddr.PreDirection} ${Info[i].PostAddr.StreetName} ${Info[i].PostAddr.StreetType} ${Info[i].PostAddr.PostDirection} - ${Info[i].PostAddr.City}, ${Info[i].PostAddr.StateProv}, ${Info[i].PostAddr.PostalCode}`)
          }
          else if (Info[i].PostAddr.hasOwnProperty("Apt") && Info[i].PostAddr.hasOwnProperty("PostDirection")) {
            console.log(`${Info[i].PostAddr.StreetNum} ${Info[i].PostAddr.StreetName} ${Info[i].PostAddr.StreetType} ${Info[i].PostAddr.PostDirection} APT ${Info[i].PostAddr.Apt} - ${Info[i].PostAddr.City}, ${Info[i].PostAddr.StateProv}, ${Info[i].PostAddr.PostalCode}`)
          }
          else if (Info[i].PostAddr.hasOwnProperty("Apt") && Info[i].PostAddr.hasOwnProperty("PreDirection")) {
            console.log(`${Info[i].PostAddr.StreetNum} ${Info[i].PostAddr.PreDirection} ${Info[i].PostAddr.StreetName} ${Info[i].PostAddr.StreetType} APT ${Info[i].PostAddr.Apt} - ${Info[i].PostAddr.City}, ${Info[i].PostAddr.StateProv}, ${Info[i].PostAddr.PostalCode}`)
          }
          else if (Info[i].PostAddr.hasOwnProperty("Apt")) {
            console.log(`${Info[i].PostAddr.StreetNum} ${Info[i].PostAddr.StreetName} ${Info[i].PostAddr.StreetType} APT ${Info[i].PostAddr.Apt} - ${Info[i].PostAddr.City}, ${Info[i].PostAddr.StateProv}, ${Info[i].PostAddr.PostalCode}`)
          }
          else if (Info[i].PostAddr.hasOwnProperty("PreDirection")) {
            console.log(`${Info[i].PostAddr.StreetNum} ${Info[i].PostAddr.PreDirection} ${Info[i].PostAddr.StreetName} ${Info[i].PostAddr.StreetType} - ${Info[i].PostAddr.City}, ${Info[i].PostAddr.StateProv}, ${Info[i].PostAddr.PostalCode}`)
          }
          else if (Info[i].PostAddr.hasOwnProperty("PostDirection")) {
            console.log(`${Info[i].PostAddr.StreetNum} ${Info[i].PostAddr.StreetName} ${Info[i].PostAddr.StreetType} ${Info[i].PostAddr.PostDirection} - ${Info[i].PostAddr.City}, ${Info[i].PostAddr.StateProv}, ${Info[i].PostAddr.PostalCode}`)
          }
          else if (Info[i].PostAddr.hasOwnProperty("StreetName")){
            console.log(`${Info[i].PostAddr.StreetNum} ${Info[i].PostAddr.StreetName} ${Info[i].PostAddr.StreetType} - ${Info[i].PostAddr.City}, ${Info[i].PostAddr.StateProv}, ${Info[i].PostAddr.PostalCode}`)
          }
        }
      }
    }
  )
  .catch(err => {
    console.log("Could not locate addresses")
  })
}

function appendRow(rowT) {
  if (rowT.DOB === null) {
    rl.question("Would you like to append to Book2.xlsx? ", answer => {
      if (answer.startsWith('y')) {
          xlsx.utils.sheet_add_json(worksheet, [rowToInsert], {skipHeader: true, origin:-1})
        
          xlsx.writeFile(workbook, "Book2.xlsx")
          console.log("Added to Excel sheet!")

      }
      else {
        console.log("There was an error")
      }
    })
  }
}


let fName = prompt("First name: ");
let mName = prompt("Middle name: ");
let lName = prompt("Last name: ")
let add = prompt("Address (convert drive to dr or lane to ln, etc.): ")
let city = prompt("City: ")
let state = prompt("Two letter state: ")
let zip = prompt("Zip code: ") 
let number = prompt("number: ")

console.log("\n")


async function run(getInfo) {
  await getInfo(fName, mName, lName, add, city, state, zip, number)
  appendRow(rowToInsert)


  rl.close();
}

run(getInformation)

rl.close();
