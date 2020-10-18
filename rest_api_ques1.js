const axios = require('axios');

function getUrlHome(page, year, team){
    return `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team1=${team}&page=${page}`;
}

function getUrlAway(page, year, team){
    return `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team2=${team}&page=${page}`;
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

async function getTotalGoals(team, year) {
    const urlHome = getUrlHome(1,year,team);
    const responseHome = await axios.get(urlHome);
    const {data: homeData, total_pages: homePages} = responseHome.data; 
    let totalCount = getGoalsHome(homeData);

    const urlAway = getUrlAway(1,year,team);
    const responseAway = await axios.get(urlAway);
    const {data: awayData, total_pages: awayPages} = responseAway.data; 
    totalCount = totalCount + getGoalsAway(awayData);

    let urlsHome = [];
    let urlsAway = [];

    for(let i = 2; i<=homePages; i++){
        urlsHome = [
            ...urlsHome,
            getUrlHome(i,year,team),
        ];
    }

    for(let i = 2; i<=awayPages; i++){
        urlsAway = [
            ...urlsAway,
            getUrlAway(i,year,team),
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