// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextApiRequest, NextApiResponse } from 'next';

import { collator } from 'src/shared/texts/collator';

const EXPOSED_STARTUP_ENVS = [ 'FAVICON_MASTER_URL' ];

export default async function configHandler(req: NextApiRequest, res: NextApiResponse) {
  const publicEnvs = Object.entries(process.env)
    .filter(([ key ]) => key.startsWith('NEXT_PUBLIC_') || EXPOSED_STARTUP_ENVS.includes(key))
    .sort(([ keyA ], [ keyB ]) => collator.compare(keyA, keyB))
    .reduce((result, [ key, value ]) => {
      result[key] = value || '';
      return result;
    }, {} as Record<string, string>);

  res.status(200).json({
    envs: publicEnvs,
  });
}
