import { CalendarDate, CalendarDateTime, getLocalTimeZone, parseAbsolute } from '@internationalized/date';

import { describe, it, expect } from 'vitest';

import { dateValidatorFactory } from './date';

const MIN = new CalendarDateTime(2026, 7, 20, 10, 0);
const MAX = new CalendarDateTime(2026, 7, 30, 18, 0);

describe('dateValidatorFactory', () => {
  it('passes when neither limit is set', () => {
    expect(dateValidatorFactory()([ new CalendarDate(1999, 1, 1) ])).toBe(true);
  });

  it('passes for an undefined value', () => {
    expect(dateValidatorFactory(MIN, MAX)(undefined)).toBe(true);
  });

  // a cleared field holds [], which used to dereference value[0] and throw
  it('passes for a cleared value instead of throwing', () => {
    expect(() => dateValidatorFactory(MIN, MAX)([])).not.toThrow();
    expect(dateValidatorFactory(MIN, MAX)([])).toBe(true);
  });

  it('passes for a value inside the limits', () => {
    expect(dateValidatorFactory(MIN, MAX)([ new CalendarDateTime(2026, 7, 25, 9, 0) ])).toBe(true);
  });

  it('passes on both boundaries', () => {
    expect(dateValidatorFactory(MIN, MAX)([ MIN ])).toBe(true);
    expect(dateValidatorFactory(MIN, MAX)([ MAX ])).toBe(true);
  });

  it('rejects a value before the minimum', () => {
    expect(dateValidatorFactory(MIN, MAX)([ new CalendarDateTime(2026, 7, 20, 9, 59) ]))
      .toBe('Date is before the minimum date');
  });

  it('rejects a value after the maximum', () => {
    expect(dateValidatorFactory(MIN, MAX)([ new CalendarDateTime(2026, 7, 30, 18, 1) ]))
      .toBe('Date is after the maximum date');
  });

  it('applies a lone minimum and a lone maximum', () => {
    expect(dateValidatorFactory(MIN)([ new CalendarDateTime(2026, 1, 1, 0, 0) ]))
      .toBe('Date is before the minimum date');
    expect(dateValidatorFactory(undefined, MAX)([ new CalendarDateTime(2027, 1, 1, 0, 0) ]))
      .toBe('Date is after the maximum date');
  });

  it('compares a date-only value at day granularity', () => {
    // same day as MAX, so the time on MAX must not push it out of range
    expect(dateValidatorFactory(MIN, MAX)([ new CalendarDate(2026, 7, 30) ])).toBe(true);
    expect(dateValidatorFactory(MIN, MAX)([ new CalendarDate(2026, 7, 31) ]))
      .toBe('Date is after the maximum date');
  });

  it('compares across value types', () => {
    const zonedMax = parseAbsolute(new CalendarDateTime(2026, 7, 30, 18, 0)
      .toDate(getLocalTimeZone()).toISOString(), getLocalTimeZone());

    expect(dateValidatorFactory(undefined, zonedMax)([ new CalendarDateTime(2026, 7, 30, 17, 0) ])).toBe(true);
    expect(dateValidatorFactory(undefined, zonedMax)([ new CalendarDateTime(2026, 7, 30, 19, 0) ]))
      .toBe('Date is after the maximum date');
  });
});
