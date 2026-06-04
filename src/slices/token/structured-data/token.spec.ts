import { it, expect, afterEach, vi, beforeEach } from 'vitest';

import { tokenInfo as tokenInfoMock } from '../mocks/info';
import generateTokenSchema from './token';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

it('generates correct schema', () => {

  const schema = generateTokenSchema({
    hash: '0x12345',
    apiData: {
      ...tokenInfoMock,
      symbol_or_name: tokenInfoMock.symbol || tokenInfoMock.name || '',
      description: 'USDT is a stablecoin',
      projectName: 'Tether',
    },
  });
  expect(schema).toMatchSnapshot();
});
