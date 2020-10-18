const axios = require('axios');

function getUrlComp(name, year){
    return `https://jsonmock.hackerrank.com/api/football_competitions?year=${year}&name=${name}`;
}

function getUrlHome(page, year, team, competition){
    return `https://jsonmock.hackerrank.com/api/football_matches?competition=${competition}&year=${year}&team1=${team}&page=${page}`;
}

function getUrlAway(page, year, team, competition){
    return `https://jsonmock.hackerrank.com/api/football_matches?competition=${competition}&year=${year}&team2=${team}&page=${page}`;
}

function getGoalsHome(data){
    let count = 0;

    data.map(({team1goals}) => {count = count + Number(team1goals)});

    return count;
}

function getGoalsAway(data){
    let count = 0;

    data.map(({team2goals}) => {count = count + Number(team2goals)});

    return count;
}

async function getWinnerTotalGoals(competition, year) {
    const {data: compData} = await axios.get(getUrlComp(competition,year));
    const {winner: team} = compData.data[0];
    const urlHome = getUrlHome(1,year,team,competition);
    const responseHome = await axios.get(urlHome);
    const {data: homeData, total_pages: homePages} = responseHome.data; 
    let totalCount = getGoalsHome(homeData);

    const urlAway = getUrlAway(1,year,team,competition);
    const responseAway = await axios.get(urlAway);
    const {data: awayData, total_pages: awayPages} = responseAway.data; 
    totalCount = totalCount + getGoalsAway(awayData);

    let urlsHome = [];
    let urlsAway = [];

    for(let i = 2; i<=homePages; i++){
        urlsHome = [
            ...urlsHome,
            getUrlHome(i,year,team,competition),
        ];
    }

    for(let i = 2; i<=awayPages; i++){
        urlsAway = [
            ...urlsAway,
            getUrlAway(i,year,team,competition),
        ];
    }

    const responsesHome = await axios.all(
        urlsHome.map(url => axios.get(url))
    )

    responsesHome.map(res => {
        const {data} = res.data;

        totalCount = totalCount + getGoalsHome(data);
    });

    const responsesAway= await axios.all(
        urlsAway.map(url => axios.get(url))
    )

    responsesAway.map(res => {
        const {data} = res.data;

        totalCount = totalCount + getGoalsAway(data);
    });

    return totalCount;
}