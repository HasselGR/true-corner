/*
THESE ARE THE LEAGUE CODES, WHEN A LEAGUE GETS OUTDATED, YO SHOULD SEARCH FOR THE LEAGUE HERE https://dashboard.api-football.com/soccer/ids, its the v2 API
 2790: premier league
 2833: la liga
 2664: ligue 1
 2857: serie a
 1333:  copa do brazil
 3265: primera division argentina
 2656: liga mx
 1341: primera division peruana
 3113: primera a (colombia)
 2755: Bundesliga
 1374: Campeonato Uruguayo
 2673: Eredivisie
 1342: Primera division de chile
 1264: Major League soccer
*/

/* the another are for release purposes, as fetchs are limited */
export const secret = 'EstaD3b3$3rL4C14v3$3creta'
export const anotherLeagues = [
  '2664',
  '2857',
  '1333',
  '3265',
  '2656',
  '1341',
  '3113',
  '2755',
  '1374',
  '2673',
  '1342',
  '1264',
]

export const anotherNames = [
  'Ligue 1',
  'Serie A',
  'Copa Do Brazil',
  'Primera Division Argentina',
  'Liga MX',
  'Primera Division Peruana',
  'Primera A',
  'Bundesliga',
  'Campeonato Uruguayo',
  'Eredivisie',
  'Primera Division de Chile',
  'Major League Soccer',
]

export const anotherMatches = [
  'Ligue_1_matches',
  'Serie_A_matches',
  'Copa_Do_Brazil_matches',
  'Primera_Division_Argentina_matches',
  'Liga_MX_matches',
  'Primera_Division_Peruana_matches',
  'Primera_A_matches',
  'Bundesliga_matches',
  'Campeonato_Uruguayo_matches',
  'Eredivisie_matches',
  'Primera_Division_de_Chile_matches',
  'Major_League_Soccer_matches',
]

/* These are the ones that are used in the release, if you want to debug, you should put less things here */
export const leagues = [
  '2790',
  // '2833',
  // '2664',
  // '2857',
  // '1333',
  // '3265',
  // '2656',
  // '1341',
  // '3113',
  // '2755',
  // '1374',
  // '2673',
  // '1342',
  // '1264',
]

export const names = [
  'Premier League',
  // 'La Liga',
  // 'Ligue 1',
  // 'Serie A',
  // 'Copa Do Brazil',
  // 'Primera Division Argentina',
  // 'Liga MX',
  // 'Primera Division Peruana',
  // 'Primera A',u
  // 'Bundesliga',
  // 'Campeonato Uruguayo',
  // 'Eredivisie',
  // 'Primera Division de Chile',
  // 'Major League Soccer',
]

export const matches = [
  'Premier_League_matches',
  // 'La_Liga_matches',
  // 'Ligue_1_matches',
  // 'Serie_A_matches',
  // 'Copa_Do_Brazil_matches',
  // 'Primera_Division_Argentina_matches',
  // 'Liga_MX_matches',
  // 'Primera_Division_Peruana_matches',
  // 'Primera_A_matches',
  // 'Bundesliga_matches',
  // 'Campeonato_Uruguayo_matches',
  // 'Eredivisie_matches',
  // 'Primera_Division_de_Chile_matches',
  // 'Major_League_Soccer_matches',
]

// this is for getting the data stored,and for building interactivity.
// country is for getting the ids of the buttons in the league
// league, and matches are for getting the standings and matches, respectively
export const arrayLeague = [
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
