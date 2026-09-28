import type { Questions, SystemOneResult, TypeSafeClient, Usage } from '@typesafe-ai/sdk';
import { TypeSafeError } from '@typesafe-ai/sdk';

import type { Window } from '../select/hunks';

// What both grids share: the client surface, the per-call record, the bounded pool and the state a
// window is sent as.

export type ScreenClient = Pick<TypeSafeClient, 'systemOne'>;

export interface CallRecord {
  readonly kind: 'noul' | 'choice';
  readonly file: string;
  readonly window: number;
  readonly ms: number;
  readonly usage: Usage;
}

// A bounded worker pool. Once one task fails nothing new starts, but the tasks already in flight
// finish and record their cells; the first failure is what the caller reports.
export async function runPool(tasks: ReadonlyArray<() => Promise<void>>, concurrency: number): Promise<TypeSafeError | undefined> {
  let next = 0;
  let failure: TypeSafeError | undefined;
  async function worker(): Promise<void> {
    while (next < tasks.length && failure === undefined) {
      const task = tasks[next];
      next += 1;
      try {
        await task();
      } catch (error) {
        if (!(error instanceof TypeSafeError)) throw error;
        failure ??= error;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
  return failure;
}

export function describeFailure(failure: TypeSafeError | undefined): string | undefined {
  return failure === undefined ? undefined : `${ failure.name }: ${ failure.message }`;
}

export function stateOf(file: string, window: Window): { readonly file: string; readonly changes: string } {
  return { file, changes: window.state };
}

export class Recorder<TCell> {
  readonly cells: Array<TCell> = [];
  readonly calls: Array<CallRecord> = [];
  model: string | undefined = undefined;

  async timed<TQuestions extends Questions>(
    kind: CallRecord['kind'],
    file: string,
    window: number,
    call: () => Promise<SystemOneResult<TQuestions>>,
  ): Promise<SystemOneResult<TQuestions>> {
    const started = performance.now();
    const result = await call();
    this.calls.push({ kind, file, window, ms: Math.round(performance.now() - started), usage: result.usage });
    this.model ??= result.model;
    return result;
  }
}
