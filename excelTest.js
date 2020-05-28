const fetch = require("node-fetch")
const token = "wLNGLMgdEwEepOUPD3fZoRZaDAtV"
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

let rowToInsert = {Name: null, DOB: null, PhoneNumbers: null, NumOfAddressWithin3Years: null, TimeAtCurrentAddress: null}

const getJson = async (firstName, midName, lastName, address, city, state, zip) => {
    const response = await fetch("https://api.microbilt.com/EnhancedPeopleSearch/GetReport", {
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
                    "Addr1": address,
                    "City": city,
                    "StateProv": state,
                    "PostalCode": zip
                  }
                }
              ]
            }
      })
      
  })
  const json = await response.json()
  return(json)
  
  
}

const insertDataToObj = async (res, addr) => {
  let address = res.Subject[0].PersonInfo.ContactInfo
  let birthDay = new Date(res.Subject[0].PersonInfo.BirthDt)
  let count = 0
  let now = new Date();

  for (let i = 0; i < address.length; i++) {
      if (address[i].hasOwnProperty('PostAddr')) { // return address

          let registeredAddress = `${address[i].PostAddr.StreetNum} ${address[i].PostAddr.StreetName} ${address[i].PostAddr.StreetType}`

          if (addr.toUpperCase().includes(registeredAddress) && i === 0) { //this checks how long they've been at their current address
            count++;
            let fromMonthsBeenThere = new Date(address[0].PostAddr.AddrCreatedDt)

            console.log(`At ${addr.toUpperCase()} since ${fromMonthsBeenThere.toDateString()}`)

            rowToInsert.TimeAtCurrentAddress = `At ${addr.toUpperCase()} since ${fromMonthsBeenThere.toDateString()}`

          }

          else if (now.getFullYear() - new Date(address[i].PostAddr.AddrCreatedDt).getFullYear() <= 3 && addr.toUpperCase().includes(registeredAddress) && i > 0) { //if the address is not their current home (Othewise if it's second on the list or so on)
          count++;
          let fromMonthsBeenThere = new Date(address[i].PostAddr.AddrCreatedDt)
          let toMonthsBeenThere = new Date(address[i-1].PostAddr.AddrCreatedDt)
  
          console.log(`At ${addr.toUpperCase()} from ${fromMonthsBeenThere.toDateString()} to ${toMonthsBeenThere.toDateString()}`)
          rowToInsert.TimeAtCurrentAddress = `At ${addr.toUpperCase()} from ${fromMonthsBeenThere.toDateString()} to ${toMonthsBeenThere.toDateString()}`
  
      }
          rowToInsert.NumOfAddressWithin3Years = count // return number of unique addresses
          console.log("NumOfAddressWithin3Years: " + count)
      }

      if (address[i].hasOwnProperty('PhoneNum')) { //return phone numbers
        rowToInsert.PhoneNumbers += address[i].PhoneNum.Phone + " "
        console.log(address[i].PhoneNum.Phone + " ")
     }

  }

  rowToInsert.DOB = birthDay //return birthday
  console.log("DOB: " + birthDay)

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
  if (rowT.DOB !== null) {
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

const main = async () => {
  let fName = prompt("First name: ");
  let mName = prompt("Middle name (optional): ");
  let lName = prompt("Last name: ")
  let addr = prompt("Address (convert drive to dr or lane to ln, etc.): ")
  let city = prompt("City: ")
  let state = prompt("Two letter state: ")
  let zip = prompt("Zip code: ")
  
  console.log("\n")

  rowToInsert.Name = fName + " " + lName  //return name
  try {
    const hello = await getJson(fName, mName, lName, addr, city, state, zip)
    setTimeout(() => {
      insertDataToObj(hello, addr)
      console.log(rowToInsert)
      rl.close()
      //appendRow(rowToInsert)
    })
  }
  catch {
    if (res.Status.StatusDesc === "NOHIT") {
      throw "Could not find customer"
    }
    else if (res.faultstring === "Access Token expired") {
      throw "Token expired"
    }
  }

}

main()