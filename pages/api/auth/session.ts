import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getEnvValue } from 'configs/app/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getIronSession<{ user: any }>(req, res, {
    cookieName: 'mechian-session-token',
    password: 'WjxkHE1fWFJnOE454A5uJwZvqeUEE6fp',
    cookieOptions: {
      secure: getEnvValue('NEXT_PUBLIC_APP_ENV') === 'production',
    },
  });
  const user = session.user;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json(user);
}
