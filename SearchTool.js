const fetch = require("node-fetch")
let token = "8R4DRFDirE1S82riAKVWw67zolsp"
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
const fs = require('fs')
let workbook = xlsx.readFile("Book2.xlsx") //this gets access to the workbook

let worksheet = workbook.Sheets["Sheet4"] //access to the worksheet, update these accordingly 

let rowToInsert = {Name: null, DOB: null, PhoneNumbers: "", NumOfAddressWithin3Years: null, TimeAtCurrentAddress: null}

const getJson = async (firstName, midName, lastName, address, city, state, zip) => {
    const response = await fetch("https://api.microbilt.com/EnhancedPeopleSearch/GetReport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + await getToken(),
        "Accept": "application/json"
    },
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
        if (address[i].PostAddr.AddrType !== "P") {

          let registeredAddress = address[i].PostAddr.hasOwnProperty("PreDirection") ? 
          `${address[i].PostAddr.StreetNum} ${address[i].PostAddr.PreDirection} ${address[i].PostAddr.StreetName} ${address[i].PostAddr.StreetType}` :
          `${address[i].PostAddr.StreetNum} ${address[i].PostAddr.StreetName} ${address[i].PostAddr.StreetType}`

          if (registeredAddress.trim().includes(addr.toUpperCase()) && i === 0) { //this checks how long they've been at their current address
            count++;
            let fromMonthsBeenThere = new Date(address[0].PostAddr.AddrCreatedDt)

            //console.log(`At ${addr.toUpperCase()} since ${fromMonthsBeenThere.toDateString()}`)

            rowToInsert.TimeAtCurrentAddress = `At ${addr.toUpperCase()} since ${fromMonthsBeenThere.toDateString()}`

          }

          else if (registeredAddress.trim().includes(addr.toUpperCase()) && i > 0) { //if the address is not their current home (Othewise if it's second on the list or so on)
          count++;
          let fromMonthsBeenThere = new Date(address[i].PostAddr.AddrCreatedDt)
          let toMonthsBeenThere = new Date(address[i-1].PostAddr.AddrCreatedDt)
  
          //console.log(`At ${addr.toUpperCase()} from ${fromMonthsBeenThere.toDateString()} to ${toMonthsBeenThere.toDateString()}`)
          rowToInsert.TimeAtCurrentAddress = `At ${addr.toUpperCase()} from ${fromMonthsBeenThere.toDateString()} to ${toMonthsBeenThere.toDateString()}`

          now.getFullYear() - new Date(address[i].PostAddr.AddrCreatedDt).getFullYear() <= 3 ? count++ : count += 0
  
          }
          else if (now.getFullYear() - new Date(address[i].PostAddr.AddrCreatedDt).getFullYear() <= 3) {
            count++
          }
          rowToInsert.NumOfAddressWithin3Years = count // return number of unique addresses
          //console.log("NumOfAddressWithin3Years: " + count)
        }
      }

      if (address[i].hasOwnProperty('PhoneNum')) { //return phone numbers
        rowToInsert.PhoneNumbers += address[i].PhoneNum.Phone + " "
        //console.log(address[i].PhoneNum.Phone + " ")
     }

  }

  rowToInsert.DOB = birthDay.toDateString() //return birthday
  //console.log("DOB: " + birthDay)

}

function appendRow(rowT) {
  if (rowT.DOB !== null) {
    rl.question("Would you like to append to Book2.xlsx? ", answer => {
      if (answer.startsWith('y')) {
        try {
          xlsx.utils.sheet_add_json(worksheet, [rowToInsert], {skipHeader: true, origin:-1})
        
          xlsx.writeFile(workbook, "Book2.xlsx")
          console.log("\nAdded to Excel sheet!")
          rl.close()
        }
        catch {
          console.log("Error! Make sure that Excel is saved and closed!")
          rl.close()
        }
      }
      else {
        rl.close()
      }
    })
  }
}

const getToken = async () => {
  const RequestToken = await fetch("https://apidev.microbilt.com/OAuth/GetAccessToken", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      "client_id": "r5I40AtGAnx9ruBiKr1s1hoPgvn5SGxZ",
      "client_secret": "VH93vZBFg08GYwcg",
      "grant_type": "client_credentials"
    })
  })

  const responseObject = await RequestToken.json()
  console.log("Token used: " + responseObject.access_token)
  return(responseObject.access_token)
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

  rowToInsert.Name = fName.toUpperCase() + " " + lName.toUpperCase()  //return name
  const hello = await getJson(fName, mName, lName, addr, city, state, zip)
  // if (hello.hasOwnProperty("fault")) {
  //   if (hello.fault.faultstring === "Access Token expired" || hello.fault.faultstring === "Invalid Access Token") {
  //     token = await getToken()
  //     setTimeout(() => {
  //       console.log(`Access token expired, new access token: ${token}. Run the program again`)
  //       rl.close()
  //     })
  //   }

  // }
  setTimeout(() => {
    if (hello.hasOwnProperty('MsgRsHdr') && hello.MsgRsHdr.Status.StatusDesc === "NOHIT") {
      throw ("could not find customer")
    }
    else {
      insertDataToObj(hello, addr)
      console.log(rowToInsert) 
      appendRow(rowToInsert)
    }
    
  })

}

main()
