// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export function getRewardNumText(type: keyof schemas['CeloEpochAggregatedElectionRewards'], num: number) {
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

export function getRewardDetailsTableTitles(type: keyof NonNullable<schemas['CeloEpochDetailed']['aggregated_election_rewards']>): [string, string] {
  switch (type) {
    case 'delegated_payment':
      return [ 'Beneficiary', 'Validator' ];
    case 'group':
      return [ 'Validator group', 'Associated validator' ];
    case 'validator':
      return [ 'Validator', 'Validator group' ];
    case 'voter':
      return [ 'Voter', 'Validator group' ];
  }
}

export function formatRewardType(type: keyof NonNullable<schemas['CeloEpochDetailed']['aggregated_election_rewards']>) {
  return type.replaceAll('_', '-');
}
