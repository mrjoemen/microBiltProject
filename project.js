const express = require('express')
const app = express();
const fetch = require("node-fetch")
const token = "ghxpCvw8fzuvD2FIAEOFXBkKbzrw"
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



getInformation = function(firstName, lastName, addr, city, state, zip, num) {
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
        let address = res.Subject[0].PersonInfo.ContactInfo
        let birthDay = new Date(res.Subject[0].PersonInfo.BirthDt)
        let count = 0

        for (let i = 0; i < address.length; i++) {
            if (address[i].hasOwnProperty('PostAddr')) {
                count++;
                let registeredAddress = `${address[i].PostAddr.StreetNum} ${address[i].PostAddr.StreetName} ${address[i].PostAddr.StreetType}`
                if (addr.toUpperCase().includes(registeredAddress) && i > 0) {
                  let fromMonthsBeenThere = new Date(address[i].PostAddr.AddrCreatedDt)
                  let toMonthsBeenThere = new Date(address[i-1].PostAddr.AddrCreatedDt)

                  console.log(`I've been at ${addr.toUpperCase()} from ${fromMonthsBeenThere.toString()} to ${toMonthsBeenThere.toString()}`)
                }
                else if (addr.toUpperCase().includes(registeredAddress) && i === 0) {
                  let fromMonthsBeenThere = new Date(address[0].PostAddr.AddrCreatedDt)

                  console.log(`I've been at ${addr.toUpperCase()} since ${fromMonthsBeenThere}`)
                }
            }

            if (address[i].hasOwnProperty('PhoneNum')) {
              if (address[i].PhoneNum.Phone === num) {
                //console.log(`Phone number: ${address[i].PhoneNum.Phone}`)
                console.log('\x1b[42m%s\x1b[0m','Phone number: ' + num)
              }
              else {
                console.log(`Phone Number: ${address[i].PhoneNum.Phone}`)
              }
           }

            
        }
        console.log(`My birthday is on ${birthDay.toString()}`)
    })
    .catch(err => {
      console.log("Information not found or typed incorrectly... try again")
      rl.close()
    })

      if (rls.keyInYN("display addresses?")) {
        displayAddresses(firstName, lastName, addr, city, state, zip, num)
      }
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

rl.question("search someone? ", ans => {
  if (ans.toLowerCase().startsWith("y")) {
    let fName = prompt("First name: ");
    let lName = prompt("Last name: ")
    let add = prompt("Address (convert drive to dr or lane to ln, etc.): ")
    let city = prompt("City: ")
    let state = prompt("Two letter state: ")
    let zip = prompt("Zip code: ")
    let number = prompt("number: ")

    console.log("\n")
    getInformation(fName, lName, add, city, state, zip, number);
    rl.close();

  }
  else {
    rl.close();
  }

})

// let fName = rls.question("First name: ");
// let lName = rls.question("Last name: ")
// let add = rls.question("Address (convert drive to dr or lane to ln, etc.): ")
// let city = rls.question("City: ")
// let state = rls.question("Two letter state: ")
// let zip = rls.question("Zip code: ")
// let number = rls.question("number: ")

// console.log("\n")
// getInformation(fName, lName, add, city, state, zip, number);

//   if (rls.keyInYN("Display addresses? Y/N: ")) {
//     displayAddresses(fName, lName, add, city, state, zip, number)
//     rl.close();
//   }
// rl.close();