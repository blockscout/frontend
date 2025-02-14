/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wallet, NonceManager, isAddress, JsonRpcProvider, parseEther } from 'ethers';
// import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { formatErrorMessage, httpLogger } from 'nextjs/utils/logger';

import { getEnvValue } from 'configs/app/utils';
import { createAndSaveRecordMoca, findEditThenSaveMoca, findOneByDiscordIdMoca } from 'lib/db';
// import { sessionOptions } from 'lib/session/config';

const provider = new JsonRpcProvider(
  getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL'),
  Number(getEnvValue('NEXT_PUBLIC_NETWORK_ID')),
  {
    staticNetwork: true,
  },
);

const _signer = new Wallet(getEnvValue('NEXT_PUBLIC_FAUCET_KEY')!, provider);
const signer = new NonceManager(_signer);

const requestLock = new Set<string>();
const requestHistory = new Map<string, string>();

export default async function faucetHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const walletAddress: string = (req.body.userWallet || '').toLowerCase();

  try {
    // const session = await getIronSession<{ user: any }>(req, res, sessionOptions);
    // user = session.user;
    // if (!user?.id) {
    //   return res.status(401).json({ error: 'Please verify your Discord first.' });
    // }

    if (requestLock.has(walletAddress)) {
      return res.status(429).json({ error: 'Too many requests.' });
    }

    let lastRequestTimeAsIso = requestHistory.get(walletAddress);
    if (!lastRequestTimeAsIso) {
      let dbUser = await findOneByDiscordIdMoca(walletAddress);
      if (!dbUser) {
        dbUser = await createAndSaveRecordMoca(walletAddress);
      }
      lastRequestTimeAsIso = dbUser.last_request_time;
    }
    const lastRequestTime = new Date(lastRequestTimeAsIso || 0).getTime();
    const requestPer = Number(getEnvValue('NEXT_PUBLIC_FAUCET_REQUEST_PER'));
    const requestPerAsHours = requestPer / 1000 / 60 / 60;
    if (Date.now() - lastRequestTime <= requestPer) {
      return res.status(429).json({
        error: `Failed: the Discord account has already request for $ZKME within the last ${ requestPerAsHours } hours. Please try again later.`,
      });
    }

    if (!isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Please enter the right address.' });
    }

    requestLock.add(walletAddress);

    const txRp = await signer.sendTransaction({
      to: walletAddress,
      value: parseEther(getEnvValue('NEXT_PUBLIC_FAUCET_VALUE')!),
    });
    // Increase transaction wait time to 10 blocks in faucet handler
    const txReceipt = await txRp.wait(10);
    if (txReceipt?.status !== 1) {
      requestLock.delete(walletAddress);
      signer.reset(); // reset nonce
      return res.status(500).json({ error: `Transaction Failure ${ txReceipt?.hash }` });
    }

    if (requestHistory.size > 10000) {
      requestHistory.clear();
    }

    const now = new Date().toISOString();
    await findEditThenSaveMoca(walletAddress, now);

    requestHistory.set(walletAddress, now);
    requestLock.delete(walletAddress);

    res.status(200).json({ hash: txReceipt.hash });
  } catch (error: any) {
    requestLock.delete(walletAddress);

    const msg = formatErrorMessage(error);
    httpLogger.logger.error({ message: msg });

    // Reset nonce when Transaction Failure
    if (msg?.includes('nonce')) {
      signer.reset();
    }

    res.status(500).json({ error: msg });
  }
}
