import browser from 'webextension-polyfill'

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
    league: 'Ligue_1',
    matches: 'Ligue_1_matches',
  },
  {
    country: 'IT',
    league: 'Serie_A',
    matches: 'Serie_A_matches',
  },
  {
    country: 'BR',
    league: 'Copa_Do_Brazil',
    matches: 'Copa_Do_Brazil_matches',
  },
  {
    country: 'AR',
    league: 'Primera_Division_Argentina',
    matches: 'Primera_Division_Argentina_matches',
  },
  {
    country: 'MX',
    league: 'Liga_MX',
    matches: 'Liga_MX_matches',
  },
  {
    country: 'PE',
    league: 'Primera_Division_Peruana',
    matches: 'Primera_Division_Peruana_matches',
  },
  {
    country: 'CO',
    league: 'Primera_A',
    matches: 'Primera_A_matches',
  },
]
const arrayStats = ['ranking', 'team', 'games', 'wins', 'losses', 'draws', 'points', 'goalsDiff']
const arrayMatches = ['homeTeam', 'score', 'awayTeam']

async function openRanks(league, matches) {
  let headerRemove = document.getElementById('league')
  headerRemove.innerHTML = ''
  let matchesTitleRemove = document.getElementById('titleMatches')
  matchesTitleRemove.innerHTML = ''
  arrayStats.forEach(stat => {
    let parent = document.getElementById(stat)
    parent.innerHTML = ''
  })
  arrayMatches.forEach(stat => {
    let title = document.getElementById(stat)
    title.innerHTML = ''
  }) 
  let matchesRemoval = document.getElementById('matches')
  if (matchesRemoval.children.length > 1 ) {
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
  })
})


const addDate = () => {
  let info = document.getElementById('info')
  let description = document.createElement('h6')
  description.appendChild(document.createTextNode(browser.i18n.getMessage('popupMessage')))
  info.appendChild(description)

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
const centeredRight = 'col-sm border-right justify-content d-flex align-items-center flex-column'
const centeredLeft = 'col-sm border-left justify-content d-flex align-items-center flex-column'
const centered = 'col-sm  justify-content d-flex align-items-center flex-column'
const addStat = (row, name, style, type = 'h6') => {
  let column = document.createElement('div')
  column.setAttribute('class', style)
  let stat = document.createElement(type)
  stat.appendChild(document.createTextNode(name))
  column.append(stat)
  row.appendChild(column)
}

const addImg = (row, name, style) => {
  let column = document.createElement('div')
  column.setAttribute('class', style)
  let stat = document.createElement('img')
  stat.setAttribute('width', '150')
  stat.setAttribute('height', '150')
  stat.setAttribute('src', name)
  column.append(stat)
  row.appendChild(column)
}





const arrayTags = ['Home Team', 'Status', 'Away Team']
const arrayMatchesStats = ['homeTeamLogo', 'scoreFullTime', 'awayTeamLogo']


const addTag = () => {
  arrayStats.forEach(stat => {
    let parent = document.getElementById(stat)
    let tag = document.createElement('h6')
    tag.appendChild(document.createTextNode(browser.i18n.getMessage(stat)))
    parent.appendChild(tag)
  })
  arrayMatches.forEach((stat, index) => {
    let parent = document.getElementById(stat)
    let tag = document.createElement('h6')
    tag.appendChild(document.createTextNode(arrayTags[index]))
    parent.appendChild(tag)
  })
}

const addLeague = (league) => {
  let header = document.getElementById('league')
  header.appendChild(document.createTextNode(`League: ${league}`))
}

const init = async (leagueParameter, matchesParameter) => {
  const league = (await browser.storage.local.get(leagueParameter))
  console.log('League: ', league)
  addLeague(leagueParameter)
  let matchesTitle = document.getElementById('titleMatches')
  matchesTitle.appendChild(document.createTextNode(browser.i18n.getMessage('titleMatches')))
  const table = browser.storage.local.get(leagueParameter)
  table.then(data => {
    console.log('league data', data)
    data[leagueParameter].forEach(team => {
      let row = document.createElement('div')
      row.setAttribute('class', 'row')
      arrayStats.forEach(element => {
        addStat(row, team[element], 'col-sm border-right')
      })
      rankings.append(row)
    })
    console.log(data)
  }).catch(error => console.error(error))

  const matches = (await browser.storage.local.get(matchesParameter))
  console.log('matches:', matches)
  const rounds = browser.storage.local.get(matchesParameter)
  rounds.then(data => {
    console.log('matches data', data)
    data[matchesParameter].forEach(match => {
      let row = document.createElement('div')
      row.setAttribute('class', 'row')
      addImg(row, match.homeTeamLogo, `${centeredRight} mt-3`)
      addStat(row, match.scoreFullTime, `${centered} text-center mt-5 `, 'h1',)
      addImg(row, match.awayTeamLogo, `${centeredLeft} mt-3`)
      round.append(row)
      let row2 = document.createElement('div')
      row2.setAttribute('class', 'row')
      addStat(row2, match.homeTeamName, centeredRight, 'h4')
      addStat(row2, match.status, centered, 'h4')
      addStat(row2, match.awayTeamName, centeredLeft, 'h4')
      round.append(row2)
      let row3 = document.createElement('div')
      row3.setAttribute('class', 'row')
      addStat(row3, '', 'col-sm border-right')
      addStat(row3, match.date.substr(0, 15), centered)
      addStat(row3, '', 'col-sm border-left')
      round.append(row3)
    })
  })
}



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
