import { describe, expect, it } from 'vitest';

import type { MockRegistration } from '../fixtures/mockRegistry';
import { formatUnmockedRequests } from './unmocked-requests';

const HEADING = 'Unmocked localhost requests. Mock each one, or answer it with an error status when the test expects a failure:';
const TOKENS_MATCHER: MockRegistration = { fixture: 'mockApiResponse', url: 'http://localhost:3003/api/v2/tokens?q=usdt&type=ERC-20' };
const CONFIG_MATCHER: MockRegistration = { fixture: 'mockConfigResponse', url: 'http://localhost:3000/assets/configs/marketplace.json' };

describe('formatUnmockedRequests', () => {
  it('says when no matcher shares the pathname and counts every matcher as other', () => {
    expect(formatUnmockedRequests([ 'http://localhost:3003/api/v2/stats' ], [ TOKENS_MATCHER, CONFIG_MATCHER ])).toBe([
      HEADING,
      '  http://localhost:3003/api/v2/stats',
      '    no registered matcher shares this pathname',
      '  2 other matchers registered',
    ].join('\n'));
  });

  // The case the check exists for: the component sent a query param the test did not restate.
  it('puts a query-param drift side by side with the matcher of the same pathname', () => {
    const unmocked = 'http://localhost:3003/api/v2/tokens?q=usdt&type=ERC-20&chain_id=1';

    expect(formatUnmockedRequests([ unmocked ], [ TOKENS_MATCHER, CONFIG_MATCHER ])).toBe([
      HEADING,
      `  ${ unmocked }`,
      `    mockApiResponse: ${ TOKENS_MATCHER.url }`,
      '  1 other matchers registered',
    ].join('\n'));
  });

  it('lists several unmocked urls once each, with their own matchers under each', () => {
    const stats = 'http://localhost:3003/api/v2/stats';
    const config = 'http://localhost:3000/assets/configs/marketplace.json?v=2';

    expect(formatUnmockedRequests([ stats, config, stats ], [ TOKENS_MATCHER, CONFIG_MATCHER ])).toBe([
      HEADING,
      `  ${ stats }`,
      '    no registered matcher shares this pathname',
      `  ${ config }`,
      `    mockConfigResponse: ${ CONFIG_MATCHER.url }`,
      '  1 other matchers registered',
    ].join('\n'));
  });
});
