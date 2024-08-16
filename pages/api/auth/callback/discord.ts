import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { formatErrorMessage, httpLogger } from 'nextjs/utils/logger';

import { getEnvValue } from 'configs/app/utils';
import { createAndSaveRecord, findOneByDiscordId } from 'lib/db';
import { sessionOptions } from 'lib/session/config';

async function getResponseJson(rp: Response) {
  try {
    const r = await rp.json();
    return r;
  } catch (err) {
    return 'No Content';
  }
}

async function getAccessToken(code: string) {
  const clientId = getEnvValue('DISCORD_CLIENT_ID');
  const clientSecret = getEnvValue('DISCORD_CLIENT_SECRET');
  const encodedCredentials = btoa(`${ clientId }:${ clientSecret }`);
  const redirectUri = `${ getEnvValue('NEXT_PUBLIC_API_PROTOCOL') }://${ getEnvValue('NEXT_PUBLIC_API_HOST') }/api/auth/callback/discord`;

  const rp = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${ encodedCredentials }`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });
  const results: any = await getResponseJson(rp);

  if (!rp.ok) {
    const message = `${ rp.status } ${ rp.statusText } Error fetching access token: ${ JSON.stringify(results) }`;
    throw new Error(message);
  }
  return results;
}

async function getUserProfile(accessToken: string) {
  const rp = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ accessToken }`,
    },
  });
  const results: any = await getResponseJson(rp);

  if (!rp.ok) {
    const message = `${ rp.status } ${ rp.statusText } Failed to get user: ${ JSON.stringify(results) }`;
    throw new Error(message);
  }
  return results;
}

async function joinGuild(accessToken: string, userId: string) {
  const botToken = getEnvValue('DISCORD_BOT_TOKEN');
  const rp = await fetch(`https://discord.com/api/v10/guilds/1271357790916575272/members/${ userId }`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bot ${ botToken }`,
    },
    body: JSON.stringify({
      access_token: accessToken,
    }),
  });
  const results: any = await getResponseJson(rp);

  if (!rp.ok) {
    const message = `${ rp.status } ${ rp.statusText } Failed to join guild: ${ JSON.stringify(results) }`;
    throw new Error(message);
  }
  return results;
}

export default async function discordCallbackHandler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  const isDenied = req.query.error as string;

  // User rejected
  if (isDenied === 'access_denied') {
    return res.redirect('/faucet');
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  const session = await getIronSession<{ user: any }>(req, res, sessionOptions);

  try {
    const tokenResults = await getAccessToken(code);
    const userResults = await getUserProfile(tokenResults.access_token);
    await joinGuild(tokenResults.access_token, userResults.id);

    const dbUser = await findOneByDiscordId(userResults.id);
    if (!dbUser) {
      await createAndSaveRecord(userResults.id, userResults.username);
    }
    userResults.lastRequestTime = dbUser?.last_request_time;

    session.user = userResults;
    await session.save();

    res.redirect('/faucet');
  } catch (error: any) {
    const msg = formatErrorMessage(error);
    httpLogger.logger.error({ message: msg });
    res.status(500).json({ error: msg });
  }
}
