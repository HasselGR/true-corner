import browser from 'webextension-polyfill'

let footer = document.getElementById('footer')
const arrayLeague = [
  {
    country: 'UK',
    league: 'Premier League',
    matches:'Premier_League_matches',
  },
  {
    country: 'ES',
    league: 'La Liga',
    matches:'La_Liga_matches',
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
    matches:'Copa_Do_Brazil_matches',
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
    matches: 'Primera_A_matches'
  },
]

function openRanks(league, matches) {
  browser.runtime.sendMessage({
    message: 'element',
    params: {
      league,
      matches,
    },
  })
}

arrayLeague.forEach(element => {
  const button = document.getElementById(element.country)
  button.addEventListener('click', () => {
    openRanks(element.league, element.matches)
  })
})


const addDate = () => {
  let info = document.getElementById('info')
  let description = document.createElement('h3')
  description.appendChild(document.createTextNode(browser.i18n.getMessage('popupMessage')))
  info.appendChild(description)
  
  browser.storage.local.get('date')
    .then(data => {
      let tag = document.createElement('h4')
      tag.appendChild(document.createTextNode(`Last updated since: ${data.date}`))
      footer.append(tag)
    })
}



addDate()
