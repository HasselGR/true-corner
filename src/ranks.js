import browser from 'webextension-polyfill'


let uList = document.getElementById('standings')

browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.message) {
    case 'createTable':
      console.log('testing event')
      // const table = browser.storage.local.get(request.params.league)
      // table.then(data => {
      //   data.Premier_League.forEach(element => {
      //     let team = document.createElement('li')
      //     let standings = document.createElement('h3')
      //     standings.appendChild(document.createTextNode(`${element.ranking}       ${element.team}       ${element.matches}       ${element.wins}      ${element.losses}       ${element.draws}      ${element.points}     ${element.goalsDiff}`))
      //     team.appendChild(standings)
      //     uList.appendChild(team)
      //   })
      // }).catch(error => console.error(error))
      break
    default:
      console.error('request not registered');
  }
})

console.log('Works!')
