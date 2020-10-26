import browser from 'webextension-polyfill'

let myHeaders = new Headers()
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
const anotherNames = ['Ligue_1', 'Serie_A', 'Copa_Do_Brazil', 'Primera_Division_Argentina', 'Liga_MX', 'Primera_Division_Peruana', 'Primera_A']

const leagues = ['2790', '2833']
const names = ['Premier_League', 'La_Liga']

const getStandings = (league, name) => {
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
          losses: element.all.lose,
          draws: element.all.draw,
          points: element.points,
          goalsDiff: element.goalsDiff,
        }
        console.log(team)
        ranks.push(team)
        browser.storage.local.set({ [ name ]: ranks })
      })
      const date = new Date()
      browser.storage.local.set({ date: date.toString() })
    })
    .catch(error => console.log(error))
}

browser.runtime.onInstalled.addListener(() => {
  leagues.forEach((element, index) => {
    getStandings(element, names[index])
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

const sendRankings = async (league) => {
  await browser.storage.local.set({ 'liga': league })
  browser.tabs.create({
    index: 0,
    url: '/ranks.html',
    active: true,
  })
}

browser.runtime.onMessage.addListener((request) => {
  switch (request.message) {
    case 'element':
      sendRankings(request.params.league)
      break
    default:
      console.log(request, 'request not handled')
  }
})


