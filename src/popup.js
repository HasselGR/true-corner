import browser from 'webextension-polyfill'
import { getStorage } from './lib/common'
import { arrayLeague } from './lib/constant'

let footer = document.getElementById('footer')

let rankings = document.getElementById('table')
let round = document.getElementById('matches')
let matchesButton = document.getElementById('watchMatches')
let rankingsButton = document.getElementById('watchStandings')

const arrayStats = [
  'team',
  'games',
  'wins',
  'draws',
  'losses',
  'goalsFor',
  'goalsAgainst',
  'points',
]

const centered = 'justify-content d-flex align-items-center flex-column'

const addTag = () => {
  arrayStats.forEach((stat) => {
    let parent = document.getElementById(stat)
    let tag = document.createElement('h6')
    tag.appendChild(document.createTextNode(browser.i18n.getMessage(stat)))
    parent.appendChild(tag)
  })
}

const addLeague = (league) => {
  let header = document.getElementById('league')
  header.appendChild(document.createTextNode(`League: ${league}`))
}

// functions to add stats, imgs, spans, everything here is for adding the data for the popup-
const addStat = (row, name, style, type = 'h6') => {
  let column = document.createElement('div')
  column.setAttribute('class', style)
  let stat = document.createElement(type)
  stat.appendChild(document.createTextNode(name))
  column.append(stat)
  row.appendChild(column)
}

const addSpan = (row, name, style) => {
  let span = document.createElement('span')
  span.setAttribute('class', style)
  span.innerHTML = `${name}`
  row.appendChild(span)
}
const addImg = (row, name, style, size = '35', styleindiv = '') => {
  let column = document.createElement('div')
  column.setAttribute('class', styleindiv)
  let stat = document.createElement('img')
  stat.setAttribute('width', size)
  stat.setAttribute('src', name)
  stat.setAttribute('class', style)
  column.append(stat)
  row.appendChild(column)
}

// This method inits and adds its respective league and matches, depending on the parameter sent..
const init = async (leagueParameter, matchesParameter) => {
  const table = await getStorage(leagueParameter)
  let flag = 0
  table.forEach((team) => {
    let row = document.createElement('div')
    if (flag === 0) {
      row.setAttribute('class', 'row strong-gray')
      flag = 1
    } else if (flag === 1) {
      row.setAttribute('class', 'row light-gray')
      flag = 0
    }
    arrayStats.forEach((element, index) => {
      if (index === 0) {
        addStat(row, team[element], 'col-5 separation table-team')
      } else if (index === 7) {
        addStat(row, team[element], 'col-1 table-stat', 'p')
      } else {
        addStat(row, team[element], 'col-1 separation table-stat', 'p')
      }
    })
    rankings.append(row)
  })

  const matches = await getStorage(matchesParameter)
  console.log('matches:', matches) // for debugging purposes, feel free to remove
  const rounds = await getStorage(matchesParameter)
  console.log('matches data', rounds) // for debugging purposes, feel free to remove
  rounds.forEach((match) => {
    // adding the matches data...
    let row = document.createElement('div')
    row.setAttribute('class', 'row match-row')
    addSpan(row, match.status, 'first d-flex align-items-center px-2 ml-2')
    addStat(row, ' ', 'separation')
    addImg(
      row,
      match.homeTeamLogo,
      `teamlogos ${centered} pl-2 pr-2`,
      '35',
      'border-bottom team-logo',
    )
    // addImg(row, match.homeTeamlogo, 'teamlogos')
    addSpan(row, match.homeTeamName, 'border-right d-flex align-items-center pr-3 border-bottom')
    addSpan(
      row,
      match.scoreFullTime,
      'px-3 border-right d-flex align-items-center justify-content-center scorebg border-bottom',
    )
    addImg(
      row,
      match.awayTeamLogo,
      `teamlogos ${centered} pl-2 pr-2`,
      '35',
      'border-bottom team-logo',
    )
    // addImg(row, match.awayTeamlogo, 'teamlogos')
    addSpan(row, match.awayTeamName, 'd-flex align-items-center border-bottom')
    round.append(row)
    let row2 = document.createElement('div')
    row2.setAttribute('class', 'row ') // border-bottom
    round.append(row2)
  })
}

// For opening the ranks when you click on a league
function openRanks(league, matches) {
  // we remove the previos info and add the new headers first,
  let header = document.getElementById('leaguename')
  header.innerHTML = ''
  let matchesDelete = document.getElementById('matches')
  matchesDelete.innerHTML = ''
  let leagueimage = document.createElement('img')
  leagueimage.setAttribute('width', '35')
  leagueimage.setAttribute('src', `./images/${league}.png`)
  leagueimage.setAttribute('class', '')
  header.appendChild(leagueimage)
  let name = document.createElement('span')
  name.innerHTML = `${league}`
  name.setAttribute('class', 'h6 ml-2')
  header.appendChild(name)
  let headerRemove = document.getElementById('league')
  headerRemove.innerHTML = ''
  arrayStats.forEach((stat) => {
    let parent = document.getElementById(stat)
    parent.innerHTML = ''
  })
  let matchesRemoval = document.getElementById('matches')
  if (matchesRemoval.children.length > 1) {
    while (matchesRemoval.children.length > 1) {
      matchesRemoval.removeChild(matchesRemoval.lastChild)
    }
  }
  let tableRemoval = document.getElementById('table')
  if (tableRemoval.children.length > 1) {
    while (tableRemoval.children.length > 1) {
      tableRemoval.removeChild(tableRemoval.lastChild)
    }
  }

  addTag()
  init(league, matches)
  document.documentElement.scrollTop = 0 // this is for  rolling back th scroll to the top if you  click on another button .
}

arrayLeague.forEach((element) => {
  const button = document.getElementById(element.country)
  button.addEventListener('click', () => {
    openRanks(element.league, element.matches)
    let change = document.querySelectorAll('.blackwhite')
    change.forEach((image) => {
      image.style.filter = 'grayscale(100%)'
    })
    button.style.filter = 'grayscale(0%)'
  })
})

const addDate = () => {
  browser.storage.local.get('date_VF').then((data) => {
    let tag = document.createElement('span')
    tag.id = 'lastUpdated'
    tag.appendChild(document.createTextNode(`Last update: ${data.date}`))
    footer.append(tag)
  })
}

matchesButton.style.fontWeight = 'bold'
rankings.style.display = 'none'

// toggles the matches and the standings.
matchesButton.addEventListener('click', () => {
  rankings.style.display = 'none'
  round.style.display = 'block'
  matchesButton.style.fontWeight = 'bold'
  rankingsButton.style.fontWeight = 'normal'
})
rankingsButton.addEventListener('click', () => {
  rankings.style.display = 'block'
  round.style.display = 'none'
  matchesButton.style.fontWeight = 'normal'
  rankingsButton.style.fontWeight = 'bold'
})

// Page start
document.addEventListener('DOMContentLoaded', function (event) {
  addDate()
  openRanks('Premier League', 'Premier_League_matches')
})

// Message listening
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.message) {
    case 'refresh-popup':
      window.location.reload()
      break
    default:
      console.warn('Unhandled message: ', request, sender)
      break
  }
})
