import { create } from 'zustand';

import { MatchReport } from '../types/report.types';
import { TournamentReport } from '../types/tournament';

interface ReportStore {
  report: MatchReport | null;
  rawJson: string | null;
  tournamentReport: TournamentReport | null;
  rawTournamentJson: string | null;
  setReport: (report: MatchReport, rawJson: string) => void;
  clearReport: () => void;
  setTournamentReport: (report: TournamentReport, rawJson: string) => void;
  clearTournamentReport: () => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  report: null,
  rawJson: null,
  tournamentReport: null,
  rawTournamentJson: null,
  setReport: (report, rawJson) =>
    set({ report, rawJson, tournamentReport: null, rawTournamentJson: null }),
  clearReport: () => set({ report: null, rawJson: null }),
  setTournamentReport: (tournamentReport, rawTournamentJson) =>
    set({ tournamentReport, rawTournamentJson, report: null, rawJson: null }),
  clearTournamentReport: () => set({ tournamentReport: null, rawTournamentJson: null }),
}));
