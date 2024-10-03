import type { NextApiRequest, NextApiResponse } from 'next';

const SEQUENCER_ENDPOINT = 'https://wvm-lambda-0755acbdae90.herokuapp.com';
const ARK_LAMBDA_CONTRACT_ADDRESS = '0xcf12cd22ee7f2cebf632ae1f867faebcb270fbb98de8e3b7321560cd487922ca';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const SEQUENCER_ENDPOINT_CONTRACT_STATE = `${ SEQUENCER_ENDPOINT }/state/${ ARK_LAMBDA_CONTRACT_ADDRESS }`;
    const response = await fetch(SEQUENCER_ENDPOINT_CONTRACT_STATE);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ARK data: ${ error }` });
  }
}
