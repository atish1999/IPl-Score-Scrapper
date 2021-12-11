const request = require('request');
const cheerio = require('cheerio');
const scorecard = require('./scorecard');
/*                 //?NEXTPAGE-->(1)
*/
const nextPage = (fullUrl) => {

    request(fullUrl, (err, response, html) => {
        if (err) {
            console.log(err);
        } else {
            extractAll(html);
        }
    });

};

const extractAll = (html) => {
    const $ = cheerio.load(html);
    const data = $('a[data-hover="Scorecard"]');
    for (let i = 0; i < data.length; ++i) {
        const url = $(data[i]).attr('href');
        let full_link = `https://www.espncricinfo.com${url}`;
        // console.log(full_link);
        getDetails(full_link);
    }

}

/*                 //?NEXTPAGE-->(2)
*/


const getDetails = (link) => {
    request(link, (err, response, html) => {
        if (err) {
            console.log(err);
        } else {
            scorecard.getBatsManData(html);
        }
    });
};

module.exports = {
    nextPage: nextPage,
}