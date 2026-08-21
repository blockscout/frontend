import { CalendarDate, CalendarDateTime, getLocalTimeZone, parseAbsolute } from '@internationalized/date';

import type { FormFields } from '../components/dialog/types';

import { describe, it, expect } from 'vitest';

import serializeFormFields from './serialize-form-fields';

// the local wall clock is what the user picked, so asserting on it keeps the
// expectations independent of the time zone the suite happens to run in
const localFieldsOf = (isoString: string) => {
  const parsed = parseAbsolute(isoString, getLocalTimeZone());
  return [ parsed.year, parsed.month, parsed.day, parsed.hour, parsed.minute ];
};

describe('serializeFormFields', () => {
  it('returns an empty object when there is no data', () => {
    expect(serializeFormFields(undefined, true)).toEqual({});
  });

  it('omits fields whose value was cleared', () => {
    const data = {
      from_period: [],
      to_period: [ new CalendarDateTime(2026, 7, 30, 12, 0) ],
    } as FormFields;

    expect(Object.keys(serializeFormFields(data, true))).toEqual([ 'to_period' ]);
  });

  it('returns an empty object when every field was cleared', () => {
    expect(serializeFormFields({ from_period: [], to_period: [] } as FormFields, true)).toEqual({});
  });

  it('resolves a CalendarDateTime in the local zone, preserving the wall clock', () => {
    const data = { from_period: [ new CalendarDateTime(2026, 7, 30, 12, 0) ] } as FormFields;

    const result = serializeFormFields(data, true).from_period;

    expect(result).toMatch(/Z$/);
    expect(localFieldsOf(result)).toEqual([ 2026, 7, 30, 12, 0 ]);
  });

  it('reads the wall clock as UTC when local time is off', () => {
    const data = { from_period: [ new CalendarDateTime(2026, 7, 30, 12, 0) ] } as FormFields;

    expect(serializeFormFields(data, false).from_period).toBe('2026-07-30T12:00:00.000Z');
  });

  it('treats a date-only value as local midnight', () => {
    const data = { from_period: [ new CalendarDate(2026, 7, 30) ] } as FormFields;

    expect(localFieldsOf(serializeFormFields(data, true).from_period)).toEqual([ 2026, 7, 30, 0, 0 ]);
  });

  it('keeps the instant of a zoned value regardless of the local zone', () => {
    const data = {
      from_period: [ parseAbsolute('2026-07-30T09:05:00Z', 'America/New_York') ],
    } as FormFields;

    expect(serializeFormFields(data, true).from_period).toBe('2026-07-30T09:05:00.000Z');
  });

  it('serializes every populated field', () => {
    const data = {
      from_period: [ new CalendarDateTime(2026, 7, 29, 8, 30) ],
      to_period: [ new CalendarDateTime(2026, 7, 30, 17, 45) ],
    } as FormFields;

    const result = serializeFormFields(data, true);

    expect(localFieldsOf(result.from_period)).toEqual([ 2026, 7, 29, 8, 30 ]);
    expect(localFieldsOf(result.to_period)).toEqual([ 2026, 7, 30, 17, 45 ]);
  });
});
