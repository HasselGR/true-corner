import browser from 'webextension-polyfill'


let uList = document.getElementById('standings')

const init = async () => {
  const league = (await browser.storage.local.get('liga'))['liga'];
  console.log('League: ', league)
  const table = browser.storage.local.get(league)
      table.then(data => {
        data[league].forEach(element => {
          let team = document.createElement('li')
          let standings = document.createElement('h3')
          standings.appendChild(document.createTextNode(`${element.ranking}       ${element.team}       ${element.matches}       ${element.wins}      ${element.losses}       ${element.draws}      ${element.points}     ${element.goalsDiff}`))
          team.appendChild(standings)
          uList.appendChild(team)
        })
        console.log(data)
      }).catch(error => console.error(error))
}

init()
console.log('Works!')
