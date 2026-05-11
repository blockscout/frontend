import { it, expect } from 'vitest';

import { detectInputType } from './detectInputType';

it('should detect EVM address format', () => {
  expect(detectInputType('0x1234567890123456789012345678901234567890')).toBe('address');
});

it('should detect cluster name format', () => {
  expect(detectInputType('test-cluster')).toBe('cluster_name');
});
