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

const contractAddress = getEnvValue('NEXT_PUBLIC_VERIFICATION_CONTRACT_ADDRESS');

export async function verificationRequest(hash: string = '') {
  try {
    const rp = await fetch(
      `https://${ url }/api/v2/addresses/${ contractAddress }/logs?${ hash || '' }`,
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
