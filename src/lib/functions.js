import { getStorage } from './common'
import { statusMatch } from './constant'

export const hasGamesInProgress = async (leagueNameMatch) => {
  const league = await getStorage(leagueNameMatch)
  return league ? league.games.filter((currentMatch) => !statusMatch.includes(currentMatch.statusShort)).length : 0
}
