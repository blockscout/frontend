import type { SuspectFateRecord } from '../origins/match';
import type { SidecarRecord } from '../sidecar';

// The pilot table's numbers, from the sidecars alone. A calibration run is left out; a review whose
// `--origins` has not run yet is listed as pending and counts nowhere, because without fates every
// suspect would read as dropped.

export const SPEC_ROW = 'spec';

export interface SidecarFile {
  readonly file: string;
  readonly record: SidecarRecord;
}

export interface RuleRow {
  readonly rule: string;
  readonly sent: number;
  readonly confirmed: number;
  readonly merged: number;
  readonly dropped: number;
  readonly topDropReason: string | undefined;
}

export interface ReportTotals {
  readonly reviews: number;
  readonly pending: number;
  readonly findings: { readonly jev: number; readonly axis: number; readonly both: number };
  readonly addedSeconds: { readonly mean: number; readonly max: number };
  readonly meanInputTokens: number;
}

export interface PilotReport {
  readonly rules: ReadonlyArray<RuleRow>;
  readonly totals: ReportTotals;
  readonly pending: ReadonlyArray<string>;
}

interface Counted extends SidecarFile {
  readonly record: SidecarRecord & { readonly origins: NonNullable<SidecarRecord['origins']> };
}

function isCounted(sidecar: SidecarFile): sidecar is Counted {
  return sidecar.record.origins !== undefined;
}

function rowKey(entry: SuspectFateRecord): string {
  return entry.suspect.kind === 'spec' ? SPEC_ROW : entry.suspect.rule;
}

function topReason(reasons: ReadonlyArray<string>): string | undefined {
  const counts = new Map<string, number>();
  for (const reason of reasons) counts.set(reason, (counts.get(reason) ?? 0) + 1);
  let top: string | undefined;
  for (const [ reason, count ] of counts) {
    if (top === undefined || count > (counts.get(top) ?? 0)) top = reason;
  }
  return top;
}

function ruleRow(rule: string, entries: ReadonlyArray<SuspectFateRecord>): RuleRow {
  const dropped = entries.filter((entry) => entry.fate === 'dropped');
  return {
    rule,
    sent: entries.length,
    confirmed: entries.filter((entry) => entry.fate === 'confirmed').length,
    merged: entries.filter((entry) => entry.fate === 'merged').length,
    dropped: dropped.length,
    topDropReason: topReason(dropped.map((entry) => entry.reason)),
  };
}

// Rubric order first, so a rule that never fired still shows its zero row; rules the rubric no
// longer has follow, and the spec grid is always the last row.
function rowOrder(ruleIds: ReadonlyArray<string>, seen: ReadonlySet<string>): Array<string> {
  const extra = [ ...seen ].filter((rule) => rule !== SPEC_ROW && !ruleIds.includes(rule)).sort();
  return [ ...ruleIds, ...extra, SPEC_ROW ];
}

function ruleRows(counted: ReadonlyArray<Counted>, ruleIds: ReadonlyArray<string>): Array<RuleRow> {
  const byRule = new Map<string, Array<SuspectFateRecord>>();
  for (const { record } of counted) {
    for (const entry of record.origins.suspects) {
      const key = rowKey(entry);
      byRule.set(key, [ ...(byRule.get(key) ?? []), entry ]);
    }
  }
  return rowOrder(ruleIds, new Set(byRule.keys())).map((rule) => ruleRow(rule, byRule.get(rule) ?? []));
}

function mean(values: ReadonlyArray<number>): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function addedSecondsOf(record: SidecarRecord): number {
  return record.calls.reduce((sum, call) => sum + call.ms, 0) / 1000;
}

export function inputTokensOf(record: SidecarRecord): number {
  return record.calls.reduce((sum, call) => sum + call.usage.input_tokens, 0);
}

function totals(counted: ReadonlyArray<Counted>, pending: number): ReportTotals {
  const findings = counted.flatMap(({ record }) => record.origins.findings);
  const seconds = counted.map(({ record }) => addedSecondsOf(record));
  return {
    reviews: counted.length,
    pending,
    findings: {
      jev: findings.filter((finding) => finding.origin === 'jev').length,
      axis: findings.filter((finding) => finding.origin === 'axis').length,
      both: findings.filter((finding) => finding.origin === 'both').length,
    },
    addedSeconds: { mean: mean(seconds), max: seconds.length === 0 ? 0 : Math.max(...seconds) },
    meanInputTokens: mean(counted.map(({ record }) => inputTokensOf(record))),
  };
}

export function aggregateReport(sidecars: ReadonlyArray<SidecarFile>, ruleIds: ReadonlyArray<string>): PilotReport {
  const pilot = sidecars.filter((sidecar) => !sidecar.record.calibration);
  const counted = pilot.filter(isCounted);
  const pending = pilot.filter((sidecar) => !isCounted(sidecar)).map((sidecar) => sidecar.file);
  return {
    rules: ruleRows(counted, ruleIds),
    totals: totals(counted, pending.length),
    pending,
  };
}
