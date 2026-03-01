import type { SafeParseReturnType, ZodType } from 'zod';

import {
  matchExportSchemaV1,
  tournamentExportSchemaV1,
  type MatchExportSchemaV1,
  type TournamentExportSchemaV1
} from './schemas';

export const parseWithSchema = <Output>(schema: ZodType<Output>, payload: unknown): Output => {
  return schema.parse(payload);
};

export const safeParseWithSchema = <Output>(
  schema: ZodType<Output>,
  payload: unknown
): SafeParseReturnType<unknown, Output> => {
  return schema.safeParse(payload);
};

export const parseMatchExport = (payload: unknown): MatchExportSchemaV1 => {
  return parseWithSchema(matchExportSchemaV1, payload);
};

export const safeParseMatchExport = (
  payload: unknown
): SafeParseReturnType<unknown, MatchExportSchemaV1> => {
  return safeParseWithSchema(matchExportSchemaV1, payload);
};

export const parseTournamentExport = (payload: unknown): TournamentExportSchemaV1 => {
  return parseWithSchema(tournamentExportSchemaV1, payload);
};

export const safeParseTournamentExport = (
  payload: unknown
): SafeParseReturnType<unknown, TournamentExportSchemaV1> => {
  return safeParseWithSchema(tournamentExportSchemaV1, payload);
};
