// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Feature } from './types';

import { getEnvValue } from '../utils';

const runnerClaimLink = getEnvValue('NEXT_PUBLIC_GAME_BADGE_CLAIM_LINK');
const puzzleClaimLink = getEnvValue('NEXT_PUBLIC_PUZZLE_GAME_BADGE_CLAIM_LINK');

const title = 'Easter eggs';

const config: Feature<{ runner?: { claimLink: string }; puzzle?: { claimLink: string } }> = (() => {
  if (runnerClaimLink || puzzleClaimLink) {
    return Object.freeze({
      title,
      isEnabled: true,
      runner: runnerClaimLink ? { claimLink: runnerClaimLink } : undefined,
      puzzle: puzzleClaimLink ? { claimLink: puzzleClaimLink } : undefined,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
