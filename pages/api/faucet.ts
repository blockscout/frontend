import { Wallet, NonceManager, isAddress, JsonRpcProvider, parseEther } from 'ethers';
import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { formatErrorMessage, httpLogger } from 'nextjs/utils/logger';

import { getEnvValue } from 'configs/app/utils';
import { findEditThenSave } from 'lib/db';

const provider = new JsonRpcProvider(
  getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL'),
  getEnvValue('NEXT_PUBLIC_NETWORK_ID'),
  {
    staticNetwork: true,
  },
);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const _signer = new Wallet(getEnvValue('FAUCET_KEY')!, provider);
const signer = new NonceManager(_signer);

export default async function faucetHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getIronSession<{ user: any }>(req, res, {
      cookieName: 'mechian-session-token',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      password: getEnvValue('SESSION_PASSWORD')!,
      cookieOptions: {
        secure: getEnvValue('NEXT_PUBLIC_APP_ENV') === 'production',
      },
    });
    const user = session.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const timestamp: number = new Date(user?.lastRequestTime || 0).getTime();
    const requetPer = Number(getEnvValue('FAUCET_REQUEST_PER'));
    if (Date.now() - timestamp <= requetPer) {
      return res.status(429).json({ error: `Only one request can be made within ${ requetPer / 1000 / 60 / 60 } hours` });
    }

    const userWallet: string = req.body.userWallet;
    if (!isAddress(userWallet)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const txRp = await signer.sendTransaction({
      to: userWallet,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: parseEther(getEnvValue('FAUCET_VALUE')!),
    });
    const txReceipt = await txRp.wait();
    if (txReceipt?.status !== 1) {
      return res.status(500).json({ error: 'Transaction Failure' });
    }

    const now = new Date().toISOString();
    session.user.lastRequestTime = now;
    await session.save();
    await findEditThenSave(user.id, userWallet, now);

    res.status(200).json({ hash: txReceipt.hash });
  } catch (error: any) {
    const msg = formatErrorMessage(error);
    httpLogger.logger.error({ message: msg });
    res.status(500).json({ error: msg });
  }
}
