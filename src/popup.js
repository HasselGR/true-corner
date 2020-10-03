import browser from 'webextension-polyfill'


const uKingdom = document.getElementById('UK')
const spain = document.getElementById('ES')
const france = document.getElementById('FR')
const italy = document.getElementById('IT')
const brazil = document.getElementById('BR')
const argentina = document.getElementById('AR')
const mexico = document.getElementById('MX')
const peru = document.getElementById('PE')
const colombia = document.getElementById('CO')


browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.message){
    case 'leagueTable':
      const standings = request.params.ranks.flat()
      console.log(standings)
      standings.forEach(element => {
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
      })
  }
})



uKingdom.addEventListener('click', function () {
  browser.runtime.sendMessage({
    message: 'Premier League',
  })
})

spain.addEventListener('click', function () {
  browser.runtime.sendMessage({
    message: 'La Liga',
  })
})

france.addEventListener('click', function () {
  browser.runtime.sendMessage({
    message: 'Ligue 1',
  })
})

italy.addEventListener('click', function () {
  browser.runtime.sendMessage({
    message: 'Serie A',
  })
})

brazil.addEventListener('click', function () {
  browser.runtime.sendMessage({
    message: 'Copa Do Brazil',
  })
})

argentina.addEventListener('click', function () {
  browser.runtime.sendMessage({
    message: 'Primera Division Argentina',
  })
})

mexico.addEventListener('click', function () {
  browser.runtime.sendMessage({
    message: 'Liga Mx',
  })
})

peru.addEventListener('click', function () {
  browser.runtime.sendMessage({
    message: 'Primera Division Peruana',
  })
})

colombia.addEventListener('click', function () {
  browser.runtime.sendMessage({
    message: 'Primera A',
  })
})
