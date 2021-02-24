import browser from 'webextension-polyfill'
import { setStorage, getStorage } from './lib/common'


let footer = document.getElementById('footer')
const arrayLeague = [
  {
    country: 'UK',
    league: 'Premier League',
    matches: 'Premier_League_matches',
  },
  {
    country: 'ES',
    league: 'La Liga',
    matches: 'La_Liga_matches',
  },
  {
    country: 'FR',
    league: 'Ligue 1',
    matches: 'Ligue_1_matches',
  },
  {
    country: 'IT',
    league: 'Serie A',
    matches: 'Serie_A_matches',
  },
  {
    country: 'BR',
    league: 'Copa Do Brazil',
    matches: 'Copa_Do_Brazil_matches',
  },
  {
    country: 'AR',
    league: 'Primera Division Argentina',
    matches: 'Primera_Division_Argentina_matches',
  },
  {
    country: 'MX',
    league: 'Liga MX',
    matches: 'Liga_MX_matches',
  },
  {
    country: 'PE',
    league: 'Primera Division Peruana',
    matches: 'Primera_Division_Peruana_matches',
  },
  {
    country: 'CO',
    league: 'Primera A',
    matches: 'Primera_A_matches',
  },
  {
    country: 'AL',
    league: 'Bundesliga',
    matches: 'Bundesliga_matches',
  },
  {
    country: 'UY',
    league: 'Campeonato Uruguayo',
    matches: 'Campeonato_Uruguayo_matches',
  },
  {
    country: 'PB',
    league: 'Eredivisie',
    matches: 'Eredivisie_matches',
  },
  {
    country: 'CH',
    league: 'Primera Division de Chile',
    matches: 'Primera_Division_de_Chile_matches',
  },
  {
    country: 'US',
    league: 'Major League Soccer',
    matches: 'Major_League_Soccer_matches',
  },
]
const arrayStats = ['ranking', 'team', 'games', 'wins', 'losses', 'draws', 'points', 'goalsDiff']
const arrayMatches = ['homeTeam', 'score', 'awayTeam']
const centeredRight = 'col-sm border-right justify-content d-flex align-items-center flex-column'
const centeredLeft = 'col-sm border-left justify-content d-flex align-items-center flex-column'
const centered = 'justify-content d-flex align-items-center flex-column'

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
const addImg = (row, name, style, size = '150', styleindiv = '') => {
  let column = document.createElement('div')
  column.setAttribute('class', styleindiv)
  let stat = document.createElement('img')
  stat.setAttribute('width', size)
  stat.setAttribute('height', size)
  stat.setAttribute('src', name)
  stat.setAttribute('class', style)
  column.append(stat)
  row.appendChild(column)
}
const addImgSpan = (row, name, style, size = '150') => {
  let img = document.createElement('img')
  img.setAttribute('class', style)
  img.setAttribute('width', size)
  img.setAttribute('height', size)
  img.setAttribute('src', name)
  row.appendChild(img)
}

const addTag = () => {
  arrayStats.forEach(stat => {
    let parent = document.getElementById(stat)
    let tag = document.createElement('h6')
    tag.appendChild(document.createTextNode(browser.i18n.getMessage(stat)))
    parent.appendChild(tag)
  })
}


async function openRanks(league, matches) {
  let header = document.getElementById('leaguename')
  header.innerHTML = ''
  let matchesDelete = document.getElementById('matches')
  matchesDelete.innerHTML = ''
  let leagueimage = document.createElement('img')
  leagueimage.setAttribute('width', '55')
  leagueimage.setAttribute('height', '55')
  leagueimage.setAttribute('src', `./images/${league}.png`)
  leagueimage.setAttribute('class', '')
  header.appendChild(leagueimage)
  let name = document.createElement('span')
  name.innerHTML = `${league}`
  name.setAttribute('class', 'h6 ml-2')
  header.appendChild(name)
  let headerRemove = document.getElementById('league')
  headerRemove.innerHTML = ''
  arrayStats.forEach(stat => {
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
  document.documentElement.scrollTop = 0
}

arrayLeague.forEach(element => {
  const button = document.getElementById(element.country)
  button.addEventListener('click', () => {
    openRanks(element.league, element.matches)
    let change = document.querySelectorAll('.blackwhite')
    change.forEach(image => {
      image.style.filter = 'grayscale(100%)'
    })
    button.style.filter = 'grayscale(0%)'
  })
})


const addDate = () => {
  browser.storage.local.get('date')
    .then(data => {
      let tag = document.createElement('h5')
      tag.appendChild(document.createTextNode(`Last updated since: ${data.date}`))
      footer.append(tag)
    })
}



addDate()


// END OF THE POPUP.JS FILE
// START OF THE RANKS.JS FILE

let rankings = document.getElementById('table')
let round = document.getElementById('matches')
let matchesButton = document.getElementById('watchMatches')
let rankingsButton = document.getElementById('watchStandings')







const arrayTags = ['Home Team', 'Status', 'Away Team']
const arrayMatchesStats = ['homeTeamLogo', 'scoreFullTime', 'awayTeamLogo']

const addLeague = (league) => {
  let header = document.getElementById('league')
  header.appendChild(document.createTextNode(`League: ${league}`))
}

const init = async (leagueParameter, matchesParameter) => {
  // const league = (await browser.storage.local.get(leagueParameter))
  const league = await getStorage(leagueParameter)
  console.log('League: ', league)
  addLeague(leagueParameter)
  // const table = browser.storage.local.get(leagueParameter)
  const table = await getStorage(leagueParameter)

  table.forEach(team => {
    let row = document.createElement('div')
    row.setAttribute('class', 'row')
    arrayStats.forEach(element => {
      addStat(row, team[element], 'col-sm border-right')
    })
    rankings.append(row)
  })


  // const matches = (await browser.storage.local.get(matchesParameter))
  const matches = await getStorage(matchesParameter)
  console.log('matches:', matches)
  // const rounds = browser.storage.local.get(matchesParameter)
  const rounds = await getStorage(matchesParameter)
  console.log('matches data', rounds)
  rounds.forEach(match => {
    let row = document.createElement('div')
    row.setAttribute('class', 'row')
    addSpan(row, match.status, 'first d-flex align-items-center px-2 ml-2')
    addStat(row, ' ', 'separation')
    addImg(row, match.homeTeamLogo, `teamlogos ${centered} pl-2 pr-2`, '55', 'border-bottom')
    // addImg(row, match.homeTeamlogo, 'teamlogos')
    addSpan(row, match.homeTeamName, 'border-right d-flex align-items-center pr-3 border-bottom')
    addSpan(row, match.scoreFullTime, 'px-3 border-right d-flex align-items-center justify-content-center scorebg border-bottom')
    addImg(row, match.awayTeamLogo, `teamlogos ${centered} pl-2 pr-2`, '55', 'border-bottom')
    // addImg(row, match.awayTeamlogo, 'teamlogos')
    addSpan(row, match.awayTeamName, 'd-flex align-items-center border-bottom')
    let breakline = document.createElement('br')
    round.append(row)
    let row2 = document.createElement('div')
    row2.setAttribute('class', 'row ')// border-bottom
    round.append(row2)
  })
}
// TO INSERT MATCHES
// let row = document.createElement('div')
//     row.setAttribute('class', 'row')
//     addImg(row, match.homeTeamLogo, `${centeredRight} mt-3`)
//     addStat(row, match.scoreFullTime, `${centered} text-center mt-5 `, 'h1',)
//     addImg(row, match.awayTeamLogo, `${centeredLeft} mt-3`)
//     round.append(row)
//     let row2 = document.createElement('div')
//     row2.setAttribute('class', 'row')
//     addStat(row2, match.homeTeamName, centeredRight, 'h4')
//     addStat(row2, match.status, centered, 'h4')
//     addStat(row2, match.awayTeamName, centeredLeft, 'h4')
//     round.append(row2)
//     let row3 = document.createElement('div')
//     row3.setAttribute('class', 'row')
//     addStat(row3, '', 'col-sm border-right')
//     addStat(row3, match.date.substr(0, 15), centered)
//     addStat(row3, '', 'col-sm border-left')
//     round.append(row3)
matchesButton.addEventListener('click', () => {
  rankings.style.display = 'none'
  round.style.display = 'block'
})
rankingsButton.addEventListener('click', () => {
  rankings.style.display = 'block'
  round.style.display = 'none'
})


// awayTeamName: element.awayTeam.team_name,
//           awayTeamLogo: element.awayTeam.logo,
//           date: element.event_date,
//           firstStart: element.firstHalfStart,
//           goalsAway: element.goalsAwayTeam,
//           goalsHome: element.goalsHomeTeam,
//           homeTeamName: element.homeTeam.team_name,
//           homeTeamLogo: element.homeTeam.logo,
//           scoreHalfTime: element.score.halftime,
//           scoreFullTime: element.score.fulltime,
//           scoreExtraTime: element.score.extratime,
//           scorePenalty: element.score.penalty,
//           status: element.status,
//           venue: element.venue,



console.log('Works!')
