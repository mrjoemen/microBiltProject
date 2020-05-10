const express = require('express')
const app = express();
const fetch = require("node-fetch")
const token = "Qzk4V3HyaUf21uB5KqAIqD0K9uZk"
const prompt = require('prompt-sync')({sigint: true});
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
const ExcelJS = require('exceljs');

let workbook = new ExcelJS.Workbook()

async function addIntoToSheet() {
  let wb = await workbook.xlsx.readFile('Book1.xlsx');
  let ws = wb.getWorksheet(1);

  const table = ws.getTable("test")
  console.log(table)

  // table.addRow(["Jose", "Dec 19, 1996", "6789959821", "3", "6 months"], 2)
  // table.commit()

  // console.log("Done!")
}

addIntoToSheet();


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
            if (address[i].hasOwnProperty('PostAddr') && now.getFullYear() - new Date(address[i].PostAddr.AddrCreatedDt).getFullYear() <= 3 ) { // return address
                count++;
                let registeredAddress = `${address[i].PostAddr.StreetNum} ${address[i].PostAddr.StreetName} ${address[i].PostAddr.StreetType}`
                if (addr.toUpperCase().includes(registeredAddress) && i > 0) { //if the address is their current home (top of the list in microbilt API)
                  let fromMonthsBeenThere = new Date(address[i].PostAddr.AddrCreatedDt)
                  let toMonthsBeenThere = new Date(address[i-1].PostAddr.AddrCreatedDt)

                  console.log(`I've been at ${addr.toUpperCase()} from ${fromMonthsBeenThere.toString()} to ${toMonthsBeenThere.toString()}`)
                }
                else if (addr.toUpperCase().includes(registeredAddress) && i === 0) {
                  let fromMonthsBeenThere = new Date(address[0].PostAddr.AddrCreatedDt)

                  console.log(`I've been at ${addr.toUpperCase()} since ${fromMonthsBeenThere}`)
                  //addIntoToSheet('f',)
                }
                rowToInsert.NumOfAddressWithin3Years = count // return number of unique addresses
                console.log("NumOfAddressWithin3Years")
            }

            if (address[i].hasOwnProperty('PhoneNum')) { //return phone numbers
              rowToInsert.PhoneNumbers = address[i].PhoneNum.Phone
              console.log('Added PhoneNumber!')
           }

        }
        rowToInsert.DOB = birthDay //return birthday
        console.log("Added DOB")
    })
    .catch(err => {
      console.log("Information not found or typed incorrectly... try again")
      rl.close()
    })

      if (rls.keyInYN("display addresses?")) {
        displayAddresses(firstName, lastName, addr, city, state, zip, num)
      }
      rowToInsert.Name = firstName + " " + lastName  //return name
      console.log('Added Name!')
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

rowToInsert = {Name: "Jose", DOB: null, PhoneNumbers: null, NumOfAddressWithin3Years: null, TimeAtCurrentAddress: null}


// let fName = prompt("First name: ");
// let mName = prompt("Middle name: ");
// let lName = prompt("Last name: ")
// let add = prompt("Address (convert drive to dr or lane to ln, etc.): ")
// let city = prompt("City: ")
// let state = prompt("Two letter state: ")
// let zip = prompt("Zip code: ")
// let number = prompt("number: ")

// console.log("\n")

// getInformation(fName, mName, lName, add, city, state, zip, number);

// addIntoToSheet(rowToInsert)

rl.close();



