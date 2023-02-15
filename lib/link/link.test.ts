import link from './link';

it('makes correct link if there are no params in path', () => {
  const result = link('stats');

  expect(result).toBe('https://blockscout.com/stats');
});

it('makes correct link if there are params in path', () => {
  const result = link('token_instance_item', { id: '42', hash: '0x67e90a54AeEA85f21949c645082FE95d77BC1E70' });

  expect(result).toBe('https://blockscout.com/token/0x67e90a54AeEA85f21949c645082FE95d77BC1E70/instance/42');
});

it('makes correct link with query params', () => {
  const result = link('tx', { id: '0x4eb3b3b35d4c4757629bee32fc7a28b5dece693af8e7a383cf4cd6debe97ecf2' }, { tab: 'index', foo: 'bar' });

  expect(result).toBe('https://blockscout.com/tx/0x4eb3b3b35d4c4757629bee32fc7a28b5dece693af8e7a383cf4cd6debe97ecf2?tab=index&foo=bar');
});
