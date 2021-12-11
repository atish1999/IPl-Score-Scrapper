const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const excel = require('./excel');

const getBatsMan = (html) => {
    const $ = cheerio.load(html);

    const placeTimeArray = $(".header-info .description").text().split(",");
    const venue = placeTimeArray[1].trim();
    const time = placeTimeArray[2].trim();
    const matchResult = $(".event .status-text").text().trim();
    // console.log(venue, " ", time);

    console.log("````````````````````````````````````````````````````````````````````````````");
    console.log(`${matchResult}`);

    const data = $(".card.content-block.match-scorecard-table>.Collapsible");
    const teamDetailsa = $(data[0]).find(".header-title.label");
    const teamDetailsb = $(data[1]).find(".header-title.label");
    const currentTeamName = $(teamDetailsa).text().split("INNINGS")[0].trim();
    const opponentTeamName = $(teamDetailsb).text().split("INNINGS")[0].trim();



    for (let idx = 0; idx < data.length; ++idx) {
        let cteam = idx == 0 ? currentTeamName : opponentTeamName;
        let oteam = idx == 0 ? opponentTeamName : currentTeamName;

        const batsManTable = $(data[idx]).find(".table.batsman tbody");
        const batsManRows = $(batsManTable).find("tr");

        for (let i = 0; i < batsManRows.length; ++i) {
            const batsManRowData = $(batsManRows[i]).find("td");
            const isonlyBatsManData = $(batsManRowData).hasClass("batsman-cell");
            if (isonlyBatsManData) {
                getData($, batsManRowData, oteam, cteam, venue, time, matchResult);
            }
        }
    }


};

const getData = ($, batsManRowData, opponentTeam, TeamName, venue, time, matchResult) => {
    let name = $(batsManRowData[0]).text().trim();
    let run = $(batsManRowData[2]).text().trim();
    let balls = $(batsManRowData[3]).text().trim();
    let fours = $(batsManRowData[4]).text().trim();
    let sixes = $(batsManRowData[5]).text().trim();
    let sr = $(batsManRowData[7]).text().trim();
    // console.log(`${name} ${sr}`);
    console.table(`${name} ${run} ${balls} ${fours} ${sixes} ${sr} ${opponentTeam} ${venue} ${time}`);

    dataOrganizer(name, run, balls, fours, sixes, sr, opponentTeam, TeamName, venue, time, matchResult);
}

const dataOrganizer = (playerName, run, balls, fours, sixes, sr, opponentTeam, TeamName, venue, time, matchResult) => {


    // ? cretaing directory according to the TeamName
    let teamPath = path.join(__dirname, "ipl", TeamName);
    directoryCreator(teamPath);

    // ? creating xlsx file according to the playerName
    let filePath = path.join(teamPath, playerName + ".xlsx");
    //**first try to read whether there is data available on that sheet or not
    // ! fetched data
    let playerContent = excel.excelReader(filePath, playerName); // player content is a json format data
    let playerObj = {
        playerName,
        run, balls,
        fours, sixes,
        sr, opponentTeam,
        venue, time,
        matchResult
    };
    //** then push the new data into that player
    playerContent.push(playerObj);
    excel.excelWriter(filePath, playerContent, playerName);

};

const directoryCreator = (filePath) => {
    if (fs.existsSync(filePath) == false)
        fs.mkdirSync(filePath);
}

module.exports = {
    getBatsManData: getBatsMan
}