import type { NextApiRequest, NextApiResponse } from 'next';
import nodeFetch from 'node-fetch';

import { getEnvValue } from 'configs/app/utils';

const translateEnpoint = getEnvValue('NOVES_TRANSLATE_ENDPOINT') as string;
const translateApiKey = getEnvValue('NOVES_TRANSLATE_API_KEY') as string;
const translateSelectedChain = getEnvValue('NOVES_SELECTED_CHAIN') as string;

const handler = async(nextReq: NextApiRequest, nextRes: NextApiResponse) => {
  if (nextReq.method !== 'POST') {
    return nextRes.status(404).send({
      success: false,
      message: 'Method not supported',
    });
  }
  const { txHash } = nextReq.body;

  const url = `${ translateEnpoint }/evm/${ translateSelectedChain }/tx/${ txHash }`;
  const headers = {
    apiKey: translateApiKey,
  };

  const apiRes = await nodeFetch(url, {
    headers,
  });

  nextRes.status(apiRes.status).send(apiRes.body);
};

export default handler;
