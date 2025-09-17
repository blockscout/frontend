import { getEnvValue } from 'configs/app/utils';

type LogsRequestParams = {
  items: Array<{
    block_hash: string;
    block_number: number;
    data: string;
    index: number;
    items_count: number;
    smart_contract: {
      hash: string;
    };
    transaction_hash: string;
  }>;
  next_page_params: {
    index: number;
    items_count: number;
    block_number: number;
  };
};

const url = getEnvValue('NEXT_PUBLIC_API_HOST');

export async function verificationRequest(hash: string = '') {
  try {
    const rp = await fetch(
      `https://${ url }/api/v2/addresses/0xEfdefe08C6cD74CFEB2f0CC2B9401c52B859B427/logs?${ hash || '' }`,
      { method: 'get' },
    );
    return rp.json() as unknown as LogsRequestParams;
  } catch (error) {
    return [];
  }
}
export async function transactionsRequest(address: string = '', hash: string = '') {
  try {
    const rp = await fetch(
      `https://${ url }/api/v2/addresses/${ address }/transactions?${ hash || '' }`,
      { method: 'get' },
    );
    return rp.json() as unknown as LogsRequestParams;
  } catch (error) {
    return [];
  }
}
