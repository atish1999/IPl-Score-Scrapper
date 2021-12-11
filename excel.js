const xlsx = require('xlsx');
const fs = require('fs');

const excelWriter = (filePath, jsonData, sheetName) => {
    //** creating a new workbook
    let newWB = xlsx.utils.book_new();
    //** creating a new workSheet by converting JSON data into xlsx format
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    //** adding worksheet into workbook and the last parameter is the name of the worksheet
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    //** writing workbooks into the excel file
    xlsx.writeFile(newWB, filePath);

};

// excelWriter("abc.xlsx", jsonData, "sheet-1");

// here sheet  is the sheet of tha fetched-workbook
const excelReader = (filePath, sheetName) => {

    if (fs.existsSync(filePath) == false) {
        return [];
    }

    // ** getting workbook from excel_sheet
    let wb = xlsx.readFile(filePath);
    // ** getting data from sheets inside that workbook
    let excel_sheet = wb.Sheets[sheetName];
    // ** converting sheets data into json format
    let json = xlsx.utils.sheet_to_json(excel_sheet);
    // console.log(json);
    return json;
};

// excelReader("abc.xlsx", "sheet-1");

module.exports = { excelReader, excelWriter };