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



function openRanks(league) {
  browser.tabs.create({
    index: 0,
    url: browser.runtime.getURL('src/ranks.html'),
    active: true,
  })
  browser.runtime.sendMessage({
    message: league,
  })
}


uKingdom.addEventListener('click', function () {
  openRanks('Premier League')
})

spain.addEventListener('click', function () {
  openRanks('La Liga')
})

france.addEventListener('click', function () {
  openRanks('Ligue 1')
})

italy.addEventListener('click', function () {
  openRanks('Serie A')
})

brazil.addEventListener('click', function () {
  openRanks('Copa Do Brazil')
})

argentina.addEventListener('click', function () {
  openRanks('Primera Division Argentina')
})

mexico.addEventListener('click', function () {
  openRanks('Liga MX')
})

peru.addEventListener('click', function () {
  openRanks('Primera Division Peruana')
})

colombia.addEventListener('click', function () {
  openRanks('Primera A')
})
