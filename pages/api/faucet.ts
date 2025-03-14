/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAddress, parseEther } from 'ethers';
import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { formatErrorMessage, httpLogger } from 'nextjs/utils/logger';

import { getEnvValue } from 'configs/app/utils';
import { findEditThenSave, findOneByDiscordId } from 'lib/db';
import { requestLock, requestHistory, signer } from 'lib/faucetState';
import { sessionOptions } from 'lib/session/config';

export default async function faucetHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const walletAddress: string = (req.body.userWallet || '').toLowerCase();
  let user = null;

  try {
    const session = await getIronSession<{ user: any }>(req, res, sessionOptions);
    user = session.user;
    if (!user?.id) {
      return res.status(401).json({ error: 'Please verify your Discord first.' });
    }

    if (requestLock.has(user.id)) {
      return res.status(429).json({ error: 'Too many requests.' });
    }
    requestLock.add(user.id);

    let lastRequestTimeAsIso = requestHistory.get(user.id);
    if (!lastRequestTimeAsIso) {
      const dbUser = await findOneByDiscordId(user.id);
      // if (!dbUser) {
      //   dbUser = await createAndSaveRecordMoca(walletAddress);
      // }
      lastRequestTimeAsIso = dbUser.last_request_time;
    }
    const lastRequestTime = new Date(lastRequestTimeAsIso || 0).getTime();
    const requestPer = Number(getEnvValue('NEXT_PUBLIC_FAUCET_REQUEST_PER'));
    const requestPerAsHours = requestPer / 1000 / 60 / 60;
    if (Date.now() - lastRequestTime <= requestPer) {
      requestLock.delete(user.id);
      return res.status(429).json({
        error: `Failed: the Discord account has already request for $ZKME within the last ${ requestPerAsHours } hours. Please try again later.`,
      });
    }

    if (!isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Please enter the right address.' });
    }

    requestLock.add(user.id);

    const txRp = await signer.sendTransaction({
      to: walletAddress,
      value: parseEther(getEnvValue('NEXT_PUBLIC_FAUCET_VALUE')!),
    });
    const txReceipt = await txRp.wait();
    if (txReceipt?.status !== 1) {
      requestLock.delete(user.id);
      signer.reset(); // reset nonce
      return res.status(500).json({ error: `Transaction Failure ${ txReceipt?.hash }` });
    }

    if (requestHistory.size > 10000) {
      requestHistory.clear();
    }

    const now = new Date().toISOString();
    await findEditThenSave(user.id, walletAddress, now);

    requestHistory.set(user.id, now);
    requestLock.delete(user.id);

    res.status(200).json({ hash: txReceipt.hash });
  } catch (error: any) {
    requestLock.delete(user.id);

    const msg = formatErrorMessage(error);
    httpLogger.logger.error({ message: msg });

    // Reset nonce when Transaction Failure
    if (msg?.includes('nonce')) {
      signer.reset();
    }

    res.status(500).json({ error: msg });
  }
}
