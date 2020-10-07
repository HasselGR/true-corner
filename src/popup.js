import browser from 'webextension-polyfill'


const arrayLeague = [
  {
    country: 'UK',
    league: 'Premier_League',
  },
  {
    country: 'ES',
    league: 'La_Liga',
  },
  {
    country: 'FR',
    league: 'Ligue_1',
  },
  {
    country: 'IT',
    league: 'Serie_A',
  },
  {
    country: 'BR',
    league: 'Copa_Do_Brazil',
  },
  {
    country: 'AR',
    league: 'Primera_Division_Argentina',
  },
  {
    country: 'MX',
    league: 'Liga_MX',
  },
  {
    country: 'PE',
    league: 'Primera_Division_Peruana',
  },
  {
    country: 'CO',
    league: 'Primera_A',
  },
]

function openRanks(league) {
  browser.runtime.sendMessage({
    message: 'element',
    params: {
      league,
    },
  })
}

arrayLeague.forEach(element => {
  const button = document.getElementById(element.country)
  button.addEventListener('click', () => {
    openRanks(element.league)
  })
})
