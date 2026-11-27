import { MINUTE } from 'src/toolkit/utils/consts';

import { vi } from 'vitest';

// A test that asserts on a date rendered in local time calls `mockLocalUtcOffset` before it renders,
// with the offset of the zone in milliseconds: `4 * HOUR` for UTC+4, `0` for UTC. The setup undoes it
// after the test.
// Stubbing the TZ env variable is not an alternative: Node applies a change to it only on the main
// thread, and a spec can run in a worker thread (Stryker's Vitest runner).

const LOCAL_FIELDS = [ 'FullYear', 'Month', 'Date', 'Day', 'Hours', 'Minutes', 'Seconds', 'Milliseconds' ] as const;

export function mockLocalUtcOffset(offset: number): void {
  vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-offset / MINUTE);

  for (const field of LOCAL_FIELDS) {
    vi.spyOn(Date.prototype, `get${ field }`).mockImplementation(function(this: Date) {
      return new Date(this.getTime() + offset)[`getUTC${ field }`]();
    });
  }
}
