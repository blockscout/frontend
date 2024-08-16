import { Wallet, NonceManager, isAddress, JsonRpcProvider, parseEther } from 'ethers';
import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { formatErrorMessage, httpLogger } from 'nextjs/utils/logger';

import { getEnvValue } from 'configs/app/utils';
import { findEditThenSave } from 'lib/db';
import { sessionOptions } from 'lib/session/config';

const provider = new JsonRpcProvider(
  getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL'),
  Number(getEnvValue('NEXT_PUBLIC_NETWORK_ID')),
  {
    staticNetwork: true,
  },
);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const _signer = new Wallet(getEnvValue('FAUCET_KEY')!, provider);
const signer = new NonceManager(_signer);

const requestLock = new Set<string>();

export default async function faucetHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let user = null;

  try {
    const session = await getIronSession<{ user: any }>(req, res, sessionOptions);
    user = session.user;
    if (!user) {
      return res.status(401).json({ error: 'Failed: please verify your Discord first.' });
    }

    if (requestLock.has(user.id)) {
      return res.status(429).json({ error: 'Failed: Too many requests.' });
    }

    const timestamp: number = new Date(user?.lastRequestTime || 0).getTime();
    const requestPer = Number(getEnvValue('FAUCET_REQUEST_PER'));
    const requestPerAsHours = requestPer / 1000 / 60 / 60;
    if (Date.now() - timestamp <= requestPer) {
      return res.status(429).json({
        error: `Failed: the Discord account has already request for $ME within the last ${ requestPerAsHours } hours. Please try again later.`,
      });
    }

    const userWallet: string = req.body.userWallet;
    if (!isAddress(userWallet)) {
      return res.status(400).json({ error: 'Failed: please enter the right address.' });
    }

    requestLock.add(user.id);

    const txRp = await signer.sendTransaction({
      to: userWallet,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: parseEther(getEnvValue('FAUCET_VALUE')!),
    });
    const txReceipt = await txRp.wait();
    if (txReceipt?.status !== 1) {
      requestLock.delete(user.id);
      return res.status(500).json({ error: `Transaction Failure ${ txReceipt?.hash }` });
    }

    const now = new Date().toISOString();
    session.user.lastRequestTime = now;
    await session.save();
    await findEditThenSave(user.id, userWallet, now);

    requestLock.delete(user.id);

    res.status(200).json({ hash: txReceipt.hash });
    //
  } catch (error: any) {
    requestLock.delete(user?.id);

    const msg = formatErrorMessage(error);
    httpLogger.logger.error({ message: msg });
    res.status(500).json({ error: msg });
  }
}
