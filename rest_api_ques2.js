const axios = require('axios');

function getUrl(page, year){
    return `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&page=${page}`;
}

function getDrawnMatches(data){
    return data.filter(({team1goals, team2goals}) => team1goals === team2goals).length;
}

async function getNumDraws(year) {
    const url = getUrl(1,year);
    const response = await axios.get(url);
    const {data} = response;
    const {data: matches, total_pages: pages} = data;
    let totalCount = getDrawnMatches(matches);

    let urls = [];

    for(let i = 2; i<=pages; i++){
        urls = [
            ...urls,
            getUrl(i,year),
        ];
    }

    const responsesArr = await axios.all(
        urls.map(url => axios.get(url))
    )

    responsesArr.map(res => {
        const {data} = res.data;

        totalCount = totalCount + getDrawnMatches(data);
    });

    return totalCount;
}