import { BigQuery } from '@google-cloud/bigquery';
import type { NextApiRequest, NextApiResponse } from 'next';

import config from 'configs/app';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { blockNumber } = req.body;

  const bigquery = new BigQuery({
    projectId: config.googleCloud.projectId,
    location: config.googleCloud.location,
  });

  const query = `SELECT * 
    FROM \`promising-rock-414216.wvm.state\`
    WHERE block_number = ${ blockNumber }
    LIMIT 1
  `;

  const options = {
    query: query,
  };

  try {
    const [ job ] = await bigquery.createQueryJob(options);
    const [ rows ] = await job.getQueryResults();

    if (rows.length > 0) {
      res.status(200).json({
        arweaveId: rows[0].arweave_id,
      });
    } else {
      res.status(404).json({
        error: 'Arweave ID not found',
      });
    }

    res.status(200).json({
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error querying BigQuery', error });
  }
}
