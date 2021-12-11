const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const playerDetails = require('./playerDetails');

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const directoryCreator = (filePath) => {
    if (fs.existsSync(filePath) == false)
        fs.mkdirSync(filePath);
}

let iplPath = path.join(__dirname, "ipl");
// console.log(iplPath);
directoryCreator(iplPath);

/*                 //?HOMEPAGE 
*/
console.log("before");
request(url, (err, response, html) => {

    if (err) {
        console.log(err);
    } else {
        extract(html);
    }

});
console.log("after");



const extract = (html) => {
    const $ = cheerio.load(html);
    let data = $("a[data-hover='View All Results']");
    let href = $(data).attr('href');
    let fullUrl = `https://www.espncricinfo.com${href}`;
    playerDetails.nextPage(fullUrl);

};




