import { create } from 'zustand';

import { MatchReport } from '../types/report';

interface ReportStore {
  report: MatchReport | null;
  rawJson: string | null;
  setReport: (report: MatchReport, rawJson: string) => void;
  clearReport: () => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  report: null,
  rawJson: null,
  setReport: (report, rawJson) => set({ report, rawJson }),
  clearReport: () => set({ report: null, rawJson: null }),
}));
