'use client';

import { useMemo } from 'react';

import { MatchList } from '../../components/tournament/MatchList';
import { PlayerLeaderboard } from '../../components/tournament/PlayerLeaderboard';
import { PlayerStatsTable } from '../../components/tournament/PlayerStatsTable';
import { TeamLeaderboard } from '../../components/tournament/TeamLeaderboard';
import { TeamStatsTable } from '../../components/tournament/TeamStatsTable';
import { TournamentSummary } from '../../components/tournament/TournamentSummary';

import type { MatchItem, PlayerStanding, PlayerStatsRow, TeamStanding, TeamStatsRow, TournamentSummaryData } from '../../components/tournament/types';

const matches: MatchItem[] = [
  {
    id: 'M17',
    date: '2026-05-08',
    venue: 'Centennial Stadium',
    teamA: 'Falcons',
    teamB: 'Titans',
    result: 'Falcons won by 4 wickets',
  },
  {
    id: 'M18',
    date: '2026-05-09',
    venue: 'Riverside Oval',
    teamA: 'Knights',
    teamB: 'Warriors',
    result: 'Warriors won by 18 runs',
  },
  {
    id: 'M19',
    date: '2026-05-10',
    venue: 'Central Park Ground',
    teamA: 'Titans',
    teamB: 'Knights',
    result: 'Titans won by 7 wickets',
  },
];

const teamStatsSource: TeamStatsRow[] = [
  { team: 'Falcons', matches: 6, wins: 4, losses: 2, runsScored: 970, runsConceded: 921, netRunRate: 0.42 },
  { team: 'Titans', matches: 6, wins: 4, losses: 2, runsScored: 944, runsConceded: 902, netRunRate: 0.36 },
  { team: 'Warriors', matches: 6, wins: 3, losses: 3, runsScored: 908, runsConceded: 899, netRunRate: 0.08 },
  { team: 'Knights', matches: 6, wins: 1, losses: 5, runsScored: 812, runsConceded: 912, netRunRate: -0.71 },
];

const playerStatsSource: PlayerStatsRow[] = [
  { player: 'A. Sharma', team: 'Falcons', matches: 6, runs: 284, average: 56.8, strikeRate: 143.3, wickets: 1 },
  { player: 'R. Iqbal', team: 'Titans', matches: 6, runs: 249, average: 41.5, strikeRate: 137.9, wickets: 0 },
  { player: 'M. Clarke', team: 'Warriors', matches: 6, runs: 221, average: 36.8, strikeRate: 131.4, wickets: 2 },
  { player: 'S. Kumar', team: 'Titans', matches: 6, runs: 188, average: 26.9, strikeRate: 125.7, wickets: 10 },
  { player: 'J. Khan', team: 'Falcons', matches: 6, runs: 102, average: 17, strikeRate: 119.2, wickets: 12 },
  { player: 'D. Roy', team: 'Warriors', matches: 6, runs: 86, average: 14.3, strikeRate: 102.4, wickets: 11 },
];

export default function TournamentPage() {
  const summary = useMemo<TournamentSummaryData>(() => {
    const totalRuns = teamStatsSource.reduce((acc, team) => acc + team.runsScored, 0);
    const totalWickets = playerStatsSource.reduce((acc, player) => acc + player.wickets, 0);

    return {
      title: 'Summer Premier League 2026',
      stage: 'Group Stage',
      teams: teamStatsSource.length,
      matchesCompleted: matches.length,
      totalMatches: 24,
      totalRuns,
      totalWickets,
    };
  }, []);

  const teamLeaderboard = useMemo<TeamStanding[]>(
    () =>
      [...teamStatsSource]
        .map((team) => ({
          team: team.team,
          played: team.matches,
          won: team.wins,
          lost: team.losses,
          points: team.wins * 2,
          netRunRate: team.netRunRate,
        }))
        .sort((a, b) => b.points - a.points || b.netRunRate - a.netRunRate),
    [],
  );

  const playerLeaderboard = useMemo<PlayerStanding[]>(
    () =>
      [...playerStatsSource]
        .map((player) => ({
          player: player.player,
          team: player.team,
          runs: player.runs,
          wickets: player.wickets,
          strikeRate: player.strikeRate,
        }))
        .sort((a, b) => b.runs - a.runs || b.wickets - a.wickets)
        .slice(0, 5),
    [],
  );

  const recentMatches = useMemo<MatchItem[]>(() => [...matches].slice(0, 3), []);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
      <TournamentSummary summary={summary} />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TeamLeaderboard teams={teamLeaderboard} />
        </div>
        <MatchList matches={recentMatches} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <PlayerLeaderboard players={playerLeaderboard} />
        <TeamStatsTable rows={teamStatsSource} />
      </section>

      <section>
        <PlayerStatsTable rows={playerStatsSource} />
      </section>
    </main>
  );
}
