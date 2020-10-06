import browser from 'webextension-polyfill'

var myHeaders = new Headers()
myHeaders.append('X-RapidAPI-Key', 'c327b55042017e95c88560420ee64e35')
/*
 2790: premier league
 2833: la liga
 2664: ligue 1
 2857: serie a
 1333:  copa do brazil
 780: primera division argentina
 2656: liga mx
 1341: primera division peruana
 1326: primera a (colombia)
*/
const anotherLeagues = ['2664', '2857', '1333', '780', '2656', '1341', '1326']
const anotherNames = ['Ligue 1', 'Serie A', 'Copa Do Brazil', 'Primera Division Argentina', 'Liga MX', 'Primera Division Peruana', 'Primera A']

const leagues = ['2790', '2833']
const names = ['Premier League', 'La Liga']

browser.runtime.onInstalled.addListener(function () {
  leagues.forEach((element, index) => {
    getStandings(element, names[index])
  })
})
// browser.runtime.onMessage.addListener((request, sender) => {
//   switch (request.message) {
//     case 'Premier League':
//       getStandings('https://v2.api-football.com/leagueTable/2790')
//       break
//     case 'La Liga':
//       getStandings('https://v2.api-football.com/leagueTable/2833')
//       break
//     case 'Ligue 1':
//       getStandings('https://v2.api-football.com/leagueTable/2664')
//       break
//     case 'Serie A':
//       getStandings('https://v2.api-football.com/leagueTable/2857')
//       break
//     case 'Copa Do Brazil':
//       getStandings('https://v2.api-football.com/leagueTable/1333')
//       break
//     case 'Primera Division Argentina':
//       getStandings('https://v2.api-football.com/leagueTable/780')
//       break
//     case 'Liga MX':
//       getStandings('https://v2.api-football.com/leagueTable/2656')
//       break
//     case 'Primera Division Peruana':
//       getStandings('https://v2.api-football.com/leagueTable/1341')
//       break
//     case 'Primera A':
//       getStandings('https://v2.api-football.com/leagueTable/1326')
//       break
//     default:
//       console.log(request, 'request not handled')
//   }
// })


function getStandings(league, name) {
  fetch(`https://v2.api-football.com/leagueTable/${league}`, {
    method: 'GET',
    headers: myHeaders,
  }).then(response => response.json())
    .then(data => {
      const tables = data.api.standings.flat()
      let ranks = []
      console.log('tables', tables)
      tables.forEach(element => {
        const team = {
          ranking: element.rank,
          team:  element.teamName,
          matches: element.all.matchsPlayed,
          wins: element.all.win,
          loses: element.all.lose,
          draws: element.all.draw,
          points: element.points,
          goalsDiff: element.goalsDiff,
        }
        console.log(team)
        ranks.push(team)
        browser.storage.local.set({ [ name ]: ranks })
      })
    })
    .catch(error => console.log(error))
}
