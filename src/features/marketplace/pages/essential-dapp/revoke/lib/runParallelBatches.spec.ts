import { describe, expect, it } from 'vitest';

import runParallelBatches from './runParallelBatches';

describe('runParallelBatches', () => {
  it('runs tasks in batches and preserves result order', async() => {
    const items = [ 1, 2, 3, 4, 5 ];
    let activeTasks = 0;
    let maxActiveTasks = 0;

    const result = await runParallelBatches(items, 2, async(item) => {
      activeTasks += 1;
      maxActiveTasks = Math.max(maxActiveTasks, activeTasks);

      await Promise.resolve();

      activeTasks -= 1;
      return item * 2;
    });

    expect(result).toEqual([ 2, 4, 6, 8, 10 ]);
    expect(maxActiveTasks).toBeLessThanOrEqual(2);
  });
});
