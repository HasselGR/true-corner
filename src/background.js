import browser from 'webextension-polyfill'

var myHeaders = new Headers()
myHeaders.append('X-RapidAPI-Key', 'c327b55042017e95c88560420ee64e35')


browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.message) {
    case 'Premier League':
      getStandings('https://v2.api-football.com/leagueTable/2790')
      break
    case 'La Liga':
      getStandings('https://v2.api-football.com/leagueTable/2833')
      break
    case 'Ligue 1':
      getStandings('https://v2.api-football.com/leagueTable/2664')
      break
    case 'Serie A':
      getStandings('https://v2.api-football.com/leagueTable/2857')
      break
    case 'Copa Do Brazil':
      getStandings('https://v2.api-football.com/leagueTable/1333')
      break
    case 'Primera Division Argentina':
      getStandings('https://v2.api-football.com/leagueTable/780')
      break
    case 'Liga MX':
      getStandings('https://v2.api-football.com/leagueTable/2656')
      break
    case 'Primera Division Peruana':
      getStandings('https://v2.api-football.com/leagueTable/1341')
      break
    case 'Primera A':
      getStandings('https://v2.api-football.com/leagueTable/1326')
      break
    default:
      console.log(request, 'request not handled')
  }
})


function getStandings(league) {
  fetch(league, {
    method: 'GET',
    headers: myHeaders,
  }).then(response => response.json())
    .then(data => {
      browser.runtime.sendMessage({
        message: 'leagueTable',
        params: {
          ranks: data.api.standings,
        },
      })
    })
    .catch(error => console.error(error))
}
