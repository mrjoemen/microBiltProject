# SearchTooljs

Hello there! This is the SearchTool that I've made using Microbilt's Enchanced People Search!

### What it does
This simple, but robust, app will ask the user for simple information about the person that you are trying to search.

it will ask for:
    * Name
    * Middle Name (optional, just press enter if not used)
    * Last Name
    * Address
    * City
    * State
    * And finally zip code

After requesting the information, it will strip all of the infomation from the response from Mircobilt and give the following infomation:
    * Name
    * Date of Birth
    * List of phone numbers that is under that individual
    * The number of address within three years
    * And the time that they have been living at the inputted address

Once the request is done, the app will ask if you would like to input the object into an excel spreadsheet, if 'yes' is selected, then it'll be inputted into the *xlsx document* that is in the same location as the app.

### Instructions:

1. Make the pull request from this repository by either:

    a. Inputting `git clone https://github.com/mrjoemen/microBiltProject.git` into the terminal at the desired location if you have Git installed in the computer.

    b. Downloading it directly from the link above and placing it at the desired location.

2. Open the command prompt (or terminal for Mac) and change directories into the folder SearchTool.js is located using cd. Here is a link for [Windows](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cd) and [Mac](https://github.com/0nn0/terminal-mac-cheatsheet#english-version).  

3. Once you are in the folder itself, input `node SearchTool.js` into the terminal.

4. Now it'll ask you to input the appropiate information to find the customer, you will just need the customer's address, first name, and last name. Middle name is optional and if it's not being used just press Enter. Lastly, none of the information has to be uppercased or capitalized, but if done it's okay.

    a. When inputting the address ensure that you convert them from [street type into its shorthand abbreviation](https://cceo.org/addressing/documents/StreetAbbreviationsGuide.pdf), do not include the post direction that is in the address, or their apartment number if it exists. For example:

        -'1234 Applewood Road NW' would be inputted as `1234 applewood rd`
        -'5678 Orangetree Street, STE 100' would be inputted as `5678 orangetree str`

    Lastly, if the address includes a pre direction then that must be included into the address because it is part of the address. For example:

        -'555 North Waterfall Drive' would be inputted as `555 N waterfall dr`
    
    b. When inputting the state, make sure to use the [state's code](https://www.factmonster.com/us/postal-information/state-abbreviations-and-state-postal-codes). For example:

        -Georgia => GA
        -New York => NY
        -Florida => FL

    c. Lastly, make sure to use just the five digit zip code when inputting it.

5. Once everything is said and done, it will display the access token that is being used, in which is not to important and can be ignored, and the program will make the request to Microbilt's database return an object. Once the object is returned, the app will trim unessential data and input the important information into an object.

6. Once the object has been made, it will appear and prompt the user if they would like to input the object into an excel spreadsheet that is located in the same folder as `SearchTool.js`.

    a. If the user inputs "yes" and all of the information looks correct to the user, it will input the information into the xlsx file, by default it is set to input information into Book2.xlsx. If you would like to change the pathway of the variable 'workbook.' If this is done, make sure to also confirm that the variable 'worksheet' is also changed to the correct worksheet.

7. Then when completed, it will say "added to excel sheet" and the program will close.

### Troubleshooting:

1. The program is throwing could not find customer

    a. Make sure that the address is correct, as this it can be the reason why it is throwing the error

    b. If everything is correct and it's throwing this error, then the customer and the provided address does not correspond.

2. Time at address is null.

    a. Make sure that the address is inputted like how it is mentioned in step 4. The algorithm compares what is inputted with what's in the Microbilt's database. Thus, at times the address can be inputted slightly different and the search will work fine, but because of that slight difference, it comparison will not be the same and cause the Time at Address to be null.

3. Error is occuring when trying to input information into excel.

    a. Make sure that the excel file is closed before attempting to input, as that will be the only way the algorithm can write information into the excel file.

    b. Make sure that is in the right location, if the excel file is moved or renamed, the algorithm must know that to input the information.  [Here is a simple guide on how to change paths](https://www.w3schools.com/nodejs/ref_path.asp)

4. Some information is empty.

    a. Sometimes, Microbilt's database will not have the information, such as previous phone numbers, ths it will be empty.