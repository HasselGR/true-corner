import browser from 'webextension-polyfill'


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



const arrayStats = ['ranking', 'team', 'games', 'wins', 'losses', 'draws', 'points', 'goalsDiff']
const arrayMatches = ['homeTeam', 'score', 'awayTeam']
const arrayTags = ['Home Team', 'Status', 'Away Team']
const arrayMatchesStats = ['homeTeamLogo', 'scoreFullTime', 'awayTeamLogo']


const addTag = () => {
  arrayStats.forEach(stat => {
    let parent = document.getElementById(stat)
    let tag = document.createElement('h5')
    tag.appendChild(document.createTextNode(browser.i18n.getMessage(stat)))
    parent.appendChild(tag)
  })
  arrayMatches.forEach((stat, index) => {
    let parent = document.getElementById(stat)
    let tag = document.createElement('h5')
    tag.appendChild(document.createTextNode(arrayTags[index]))
    parent.appendChild(tag)
  })
  
}

const addLeague = (league) => {
  let header = document.getElementById('league')
  let title = document.getElementById('title')
  header.appendChild(document.createTextNode(`League: ${league}`))
  title.appendChild(document.createTextNode(league))
}
const init = async () => {
  const league = (await browser.storage.local.get('liga'))['liga']
  console.log('League: ', league)
  addLeague(league)
  let matchesTitle = document.getElementById('titleMatches')
  matchesTitle.appendChild(document.createTextNode(browser.i18n.getMessage('titleMatches')))
  const table = browser.storage.local.get(league)
  table.then(data => {
    console.log('league data', data)
    data[league].forEach(team => {
      let row = document.createElement('div')
      row.setAttribute('class', 'row')
      arrayStats.forEach(element => {
        addStat(row, team[element], 'col-sm border-right')
      })
      rankings.append(row)
    })
    console.log(data)
  }).catch(error => console.error(error))

  const matches = (await browser.storage.local.get('partidos'))['partidos']
  console.log('matches:', matches)
  const rounds = browser.storage.local.get(matches)
  rounds.then(data => {
    console.log('matches data', data)
    data[matches].forEach(match => {
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
      addStat(row3, match.date.substr(0, 9), centered)
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

addTag()
init()
console.log('Works!')
