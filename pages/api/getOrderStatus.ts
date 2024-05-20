/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const query = req?.query;

  const apiKey = '842e84293cab92e7a4f26e593956867ac659e649c0089c7df8c0c2e3c293b12e';

  if (!apiKey) {
    res.status(400).send({ data: 'No API Key found!' });
    return;
  }
  if (!query?.orderId) {
    res.status(400).send({ data: 'No Order ID found!' });
    return;
  }
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ apiKey }`,
    },
  };
  const isOnTestnet = query?.isTestnet;
  let endpoint = `https://open-api.unisat.io/v2/inscribe/order/${ query?.orderId }`;
  if (isOnTestnet === 'true') {
    endpoint = `https://open-api-testnet.unisat.io/v2/inscribe/order/${ query?.orderId }`;
  }
  try {
    const response = await fetch(endpoint, requestOptions);
    if (response?.ok) {

      const data: any = await response?.json();

      res.status(200).json({ data: data?.data });
    }
    res.status(500).json({
      data: 'Some error occured',
    });
  } catch (error) {
    res.status(500).json({
      data: 'Some error occured',
    });
  }
}
