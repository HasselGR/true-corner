import browser from 'webextension-polyfill'

let myHeaders = new Headers()
myHeaders.append('X-RapidAPI-Key', 'c327b55042017e95c88560420ee64e35')


var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
}

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
const anotherNames = ['Ligue_1', 'Serie_A', 'Copa_Do_Brazil', 'Primera_Division_Argentina', 'Liga_MX', 'Primera_Division_Peruana', 'Primera_A']
const anotherMatches = ['Ligue_1_matches', 'Serie_A_matches', 'Copa_Do_Brazil_matches', 'Primera_Division_Argentina_matches', 'Liga_MX_matches', 'Primera_Division_Peruana_matches', 'Primera_A_matches']

const leagues = ['2790', '2833']
const names = ['Premier League', 'La Liga']
const matches = ['Premier_League_matches', 'La_Liga_matches']

let ranks = {}
let current = ''

const getStandings = (league, name, matches) => {
  fetch(`https://v2.api-football.com/leagueTable/${league}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      const tables = data.api.standings.flat()
      let teams = []
      // console.log('tables', tables)
      tables.forEach(element => {
        const team = {
          ranking: element.rank,
          team:  element.teamName,
          games: element.all.matchsPlayed,
          wins: element.all.win,
          losses: element.all.lose,
          draws: element.all.draw,
          points: element.points,
          goalsDiff: element.goalsDiff,
        }
        teams.push(team)
      })
      console.log('teams before insertion', teams)
      browser.storage.local.set({ [ name ]: teams })
    })
    .catch(error => console.log(error))

  // FOR FETCHING THE CURRENT ROUND, FIX.
  // fetch(`https://v2.api-football.com/fixtures/rounds/${league}/current`, {
  //   method: 'GET',
  //   headers: myHeaders,
  // }).then(response => response.json())
  //   .then(data => {
  //     current = `${data.api.fixtures[0]}/`
  //     console.log('current', current)
  //     console.log(`fixture fetch: https://v2.api-football.com/fixtures/league/${league}/${current}`)
  //   })
  //   .catch(error => console.log(error))


  fetch(`https://v2.api-football.com/fixtures/league/2790/Regular_Season_-_7/`, requestOptions)
    .then(response => response.json())
    .then(data => {
      // console.log('games', data)
      const fixtures = data.api.fixtures
      let games = []
      fixtures.forEach(element => {
        const match = {
          awayTeamName: element.awayTeam.team_name,
          awayTeamLogo: element.awayTeam.logo,
          date: element.event_date,
          firstStart: element.firstHalfStart,
          goalsAway: element.goalsAwayTeam,
          goalsHome: element.goalsHomeTeam,
          homeTeamName: element.homeTeam.team_name,
          homeTeamLogo: element.homeTeam.logo,
          scoreHalfTime: element.score.halftime,
          scoreFullTime: element.score.fulltime,
          scoreExtraTime: element.score.extratime,
          scorePenalty: element.score.penalty,
          status: element.status,
          venue: element.venue,
        }
        games.push(match)
      })
      console.log('games before insertion', games)
      browser.storage.local.set({ [ matches ]: games })
    })
    .catch(error => console.log(error))

}

browser.runtime.onInstalled.addListener(() => {
  browser.browserAction.setPopup({
    popup: 'popup.html',
  })
  leagues.forEach((element, index) => {
    getStandings(element, names[index], matches[index])
  })
  const date = new Date()
  browser.storage.local.set({ date: date.toString() })

  let test = browser.storage.local.get()
  test.then( data => {
    console.log('data of storage', data)
  })
})

const updater = browser.alarms.create('Daily Updater', {
  delayInMinutes: 1440,
  periodInMinutes: 1440,
})


browser.alarms.onAlarm.addListener(() => {
  leagues.forEach((element, index) => {
    getStandings(element, names[index])
  })
  
})

const sendRankings = async (league, dates, sendResponse) => {
  await browser.storage.local.set({ 'liga': league, 'partidos': dates })
  sendResponse({ response: 'Success!' })
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.message) {
    case 'element':
      sendRankings(request.params.league, request.params.matches, sendResponse)
      return true
    default:
      console.log(request, 'request not handled')
  }
})

