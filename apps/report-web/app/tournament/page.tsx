'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { LeaderboardTables } from '../../components/tournament/LeaderboardTables';
import { MatchList } from '../../components/tournament/MatchList';
import { TournamentCharts } from '../../components/tournament/TournamentCharts';
import { TournamentSummary } from '../../components/tournament/TournamentSummary';
import { useReportStore } from '../../lib/store';

import type {
  LeaderboardRow,
  MatchItem,
  TeamPerformancePoint,
  TeamStanding,
  TournamentSummaryData,
} from '../../components/tournament/types';

type TeamAccumulator = {
  team: string;
  played: number;
  won: number;
  lost: number;
  runsFor: number;
  runsAgainst: number;
  ballsFaced: number;
  ballsBowled: number;
};

type PlayerAccumulator = {
  name: string;
  team: string;
  runs: number;
  wickets: number;
  ballsFaced: number;
  ballsBowled: number;
  runsConceded: number;
};

function oversToBalls(overs: number): number {
  const whole = Math.trunc(overs);
  const balls = Math.round((overs - whole) * 10);
  return whole * 6 + balls;
}

export default function TournamentPage() {
  const tournamentReport = useReportStore((state) => state.tournamentReport);

  const matches = useMemo(() => tournamentReport?.matches ?? [], [tournamentReport?.matches]);

  const computed = useMemo(() => {
    const teamMap = new Map<string, TeamAccumulator>();
    const playerMap = new Map<string, PlayerAccumulator>();
    const runsDistribution: { match: string; runs: number }[] = [];
    const recentMatches: MatchItem[] = [];

    const ensureTeam = (teamId: string, teamName: string) => {
      if (!teamMap.has(teamId)) {
        teamMap.set(teamId, {
          team: teamName,
          played: 0,
          won: 0,
          lost: 0,
          runsFor: 0,
          runsAgainst: 0,
          ballsFaced: 0,
          ballsBowled: 0,
        });
      }

      return teamMap.get(teamId)!;
    };

    const ensurePlayer = (playerId: string, name: string, teamName: string) => {
      if (!playerMap.has(playerId)) {
        playerMap.set(playerId, {
          name,
          team: teamName,
          runs: 0,
          wickets: 0,
          ballsFaced: 0,
          ballsBowled: 0,
          runsConceded: 0,
        });
      }

      return playerMap.get(playerId)!;
    };

    matches.forEach((match, index) => {
      const teamA = ensureTeam(match.teamA.id, match.teamA.name);
      const teamB = ensureTeam(match.teamB.id, match.teamB.name);
      teamA.played += 1;
      teamB.played += 1;

      const playersById = new Map<string, { name: string; teamName: string }>();
      match.teamA.players.forEach((player) =>
        playersById.set(player.id, { name: player.name, teamName: match.teamA.name }),
      );
      match.teamB.players.forEach((player) =>
        playersById.set(player.id, { name: player.name, teamName: match.teamB.name }),
      );

      let totalMatchRuns = 0;

      match.innings.forEach((innings) => {
        const battingTeam = innings.teamId === match.teamA.id ? teamA : teamB;
        const bowlingTeam = innings.teamId === match.teamA.id ? teamB : teamA;

        battingTeam.runsFor += innings.totalRuns;
        battingTeam.ballsFaced += oversToBalls(innings.totalOvers);
        bowlingTeam.runsAgainst += innings.totalRuns;
        bowlingTeam.ballsBowled += oversToBalls(innings.totalOvers);
        totalMatchRuns += innings.totalRuns;

        innings.battingScorecard.forEach((row) => {
          const playerMeta = playersById.get(row.playerId);
          if (!playerMeta) return;
          const player = ensurePlayer(row.playerId, playerMeta.name, playerMeta.teamName);
          player.runs += row.runs;
          player.ballsFaced += row.balls;
        });

        innings.bowlingScorecard.forEach((row) => {
          const playerMeta = playersById.get(row.playerId);
          if (!playerMeta) return;
          const player = ensurePlayer(row.playerId, playerMeta.name, playerMeta.teamName);
          player.wickets += row.wickets;
          player.runsConceded += row.runs;
          player.ballsBowled += oversToBalls(row.overs);
        });
      });

      const inningsA = match.innings.find((innings) => innings.teamId === match.teamA.id);
      const inningsB = match.innings.find((innings) => innings.teamId === match.teamB.id);

      if (inningsA && inningsB) {
        if (inningsA.totalRuns > inningsB.totalRuns) {
          teamA.won += 1;
          teamB.lost += 1;
        } else if (inningsB.totalRuns > inningsA.totalRuns) {
          teamB.won += 1;
          teamA.lost += 1;
        }
      }

      runsDistribution.push({
        match: `Match ${index + 1}`,
        runs: totalMatchRuns,
      });

      recentMatches.push({
        id: match.id,
        date: match.date ?? '-',
        teamA: match.teamA.name,
        teamB: match.teamB.name,
        scoreSummary: `${match.teamA.name} ${inningsA?.totalRuns ?? 0}/${inningsA?.totalWickets ?? 0} · ${match.teamB.name} ${inningsB?.totalRuns ?? 0}/${inningsB?.totalWickets ?? 0}`,
        result:
          inningsA && inningsB
            ? inningsA.totalRuns === inningsB.totalRuns
              ? 'Match tied'
              : inningsA.totalRuns > inningsB.totalRuns
                ? `${match.teamA.name} won`
                : `${match.teamB.name} won`
            : 'Result unavailable',
        reportHref: '/report',
      });
    });

    const teamLeaderboard: TeamStanding[] = [...teamMap.values()]
      .map((team) => {
        const runRateFor = team.ballsFaced > 0 ? (team.runsFor / team.ballsFaced) * 6 : 0;
        const runRateAgainst = team.ballsBowled > 0 ? (team.runsAgainst / team.ballsBowled) * 6 : 0;
        return {
          team: team.team,
          played: team.played,
          won: team.won,
          lost: team.lost,
          points: team.won * 2,
          netRunRate: Number((runRateFor - runRateAgainst).toFixed(2)),
        };
      })
      .sort((a, b) => b.points - a.points || b.netRunRate - a.netRunRate);

    const players = [...playerMap.values()];

    const topRuns: LeaderboardRow[] = [...players]
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 5)
      .map((player) => ({ name: player.name, team: player.team, value: player.runs }));

    const topWickets: LeaderboardRow[] = [...players]
      .sort((a, b) => b.wickets - a.wickets)
      .slice(0, 5)
      .map((player) => ({ name: player.name, team: player.team, value: player.wickets }));

    const topStrikeRate: LeaderboardRow[] = [...players]
      .filter((player) => player.ballsFaced >= 10)
      .sort((a, b) => b.runs / b.ballsFaced - a.runs / a.ballsFaced)
      .slice(0, 5)
      .map((player) => ({
        name: player.name,
        team: player.team,
        value: (player.runs / player.ballsFaced) * 100,
      }));

    const bestEconomy: LeaderboardRow[] = [...players]
      .filter((player) => player.ballsBowled >= 6)
      .sort((a, b) => a.runsConceded / a.ballsBowled - b.runsConceded / b.ballsBowled)
      .slice(0, 5)
      .map((player) => ({
        name: player.name,
        team: player.team,
        value: (player.runsConceded / player.ballsBowled) * 6,
      }));

    const summary: TournamentSummaryData = {
      title: tournamentReport?.tournamentName ?? '',
      stage: 'Tournament Summary',
      totalMatches: matches.length,
      teams: teamMap.size,
      totalRuns: runsDistribution.reduce((acc, item) => acc + item.runs, 0),
      totalWickets: players.reduce((acc, player) => acc + player.wickets, 0),
    };

    const wicketsByTeam = players.reduce<Record<string, number>>((acc, player) => {
      acc[player.team] = (acc[player.team] ?? 0) + player.wickets;
      return acc;
    }, {});

    const teamPerformance: TeamPerformancePoint[] = [...teamMap.values()].map((team) => ({
      team: team.team,
      runs: team.runsFor,
      wickets: wicketsByTeam[team.team] ?? 0,
    }));

    return {
      summary,
      teamLeaderboard,
      topRuns,
      topWickets,
      topStrikeRate,
      bestEconomy,
      recentMatches: recentMatches.slice(0, 6),
      runsDistribution,
      teamPerformance,
    };
  }, [matches, tournamentReport?.tournamentName]);

  if (!tournamentReport) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 p-4 text-center md:p-8">
        <h1 className="text-2xl font-semibold">No tournament report loaded</h1>
        <p className="max-w-2xl text-muted-foreground">
          Upload your Innings Pro JSON on the home page to generate a tournament report with standings, leaderboards,
          charts, and recent matches.
        </p>
        <Link href="/" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
          Go to upload page
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
      <TournamentSummary summary={computed.summary} />

      <LeaderboardTables
        runs={computed.topRuns}
        wickets={computed.topWickets}
        strikeRate={computed.topStrikeRate}
        economy={computed.bestEconomy}
        teams={computed.teamLeaderboard}
      />

      <TournamentCharts
        runsDistribution={computed.runsDistribution}
        teamPerformance={computed.teamPerformance}
      />

      <MatchList matches={computed.recentMatches} />
    </main>
  );
}
