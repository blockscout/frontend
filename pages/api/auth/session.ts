import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { sessionOptions } from 'lib/session/config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getIronSession<{ user: any }>(req, res, sessionOptions);
  const user = session.user;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json(user);
}
