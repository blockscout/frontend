import type { BlockEpoch } from 'types/api/block';

export function getRewardNumText(type: keyof BlockEpoch['aggregated_election_rewards'], num: number) {
  const postfix1 = num !== 1 ? 's' : '';
  const postfix2 = num !== 1 ? 'es' : '';

  const text = (() => {
    switch (type) {
      case 'delegated_payment':
        return 'payment' + postfix1;
      case 'group':
        return 'group reward' + postfix1;
      case 'validator':
        return 'validator' + postfix1;
      case 'voter':
        return 'voting address' + postfix2;
      default:
        return '';
    }
  })();

  if (!text) {
    return '';
  }

  return `${ num } ${ text }`;
}
