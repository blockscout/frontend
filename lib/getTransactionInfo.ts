import { useState, useEffect } from 'react';

import type { CustomTransaction, GetTransactionByHashResponse } from 'types/api/transaction';

import { getEnvValue } from 'configs/app/utils';

export function useFetchTransactionByHash(hash: string) {
  const [ data, setData ] = useState<CustomTransaction | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<unknown>('');

  const GRAPHQL_SERVER_URL = getEnvValue(
    'NEXT_PUBLIC_CUSTOM_GRAPHQL_SERVER_BASE_URL',
  ) as string;

  useEffect(() => {
    async function fetchTransactionByHash() {
      try {
        setLoading(true);
        const query = JSON.stringify({
          operationName: 'TransactionByHash',
          query: `
            query TransactionByHash($hash: Bytes32!) {
              transaction(hash: $hash) {
                hash
                index
                nonce
                from
                to
                value
                burn
                gas
                gasUsed
                gasPrice
                inputData
                status
                block {
                  hash
                  number
                  timestamp
                  __typename
                }
                tokenTransactions {
                  trxIndex
                  tokenAddress
                  tokenName
                  tokenSymbol
                  tokenType
                  tokenId
                  tokenDecimals
                  type
                  sender
                  recipient
                  amount
                  __typename
                }
                __typename
              }
            }
          `,
          variables: { hash },
        });

        const response = await fetch(GRAPHQL_SERVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: query,
        });

        if (!response.ok) {
          throw new Error('Fetching transaction info failed');
        }

        const result = (await response.json()) as GetTransactionByHashResponse;

        // Transform result to match CustomTransaction type
        const CustomTransaction: CustomTransaction = {
          ...result.data.transaction,
        };

        setData(CustomTransaction);
      } catch (error: unknown) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactionByHash();
  }, [ GRAPHQL_SERVER_URL, hash ]);

  return { data, loading, error };
}
