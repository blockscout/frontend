import { useBoolean } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Transaction, ExplorerTransaction, ExplorerTransactionDetail } from 'types/api/transaction';

import config from 'configs/app';
import { getEnvValue } from 'configs/app/utils';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { retry } from 'lib/api/useQueryClientConfig';
import { SECOND } from 'lib/consts';
import delay from 'lib/delay';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { TX, TX_ZKEVM_L2 } from 'stubs/tx';

const rollupFeature = config.features.rollup;

export type TxQuery = UseQueryResult<Transaction, ResourceError<{ status: number }>> & {
  socketStatus: 'close' | 'error' | undefined;
  setRefetchOnError: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  };
};

interface Params {
  hash?: string;
  isEnabled?: boolean;
}

export default function useTxQuery(params?: Params): TxQuery {
  const [ socketStatus, setSocketStatus ] = React.useState<'close' | 'error'>();
  const [ isRefetchEnabled, setRefetchEnabled ] = useBoolean(false);
  const [ requestFlag, setRequestFlag ] = React.useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const hash = params?.hash ?? getQueryParamString(router.query.hash);
  const url = getEnvValue('NEXT_PUBLIC_CREDENTIAL_API_HOST');

  const queryResult = useApiQuery<'tx', { status: number }>('tx', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && params?.isEnabled !== false,
      refetchOnMount: false,
      placeholderData: rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' ? TX_ZKEVM_L2 : TX,
      retry: (failureCount, error) => {
        if (isRefetchEnabled) {
          return false;
        }

        return retry(failureCount, error);
      },
      refetchInterval: (): number | false => {
        return isRefetchEnabled ? 15 * SECOND : false;
      },
    },
  });
  const { data, isError, isPlaceholderData, isPending } = queryResult;
  const request = React.useCallback(async() => {
    if (requestFlag) return;
    setRequestFlag(true);
    try {
      const rp1 = await (await fetch(url + `/api/v1/explorer/${ router.query.tab }/${ hash }`,
        { method: 'get' })).json() as ExplorerTransaction;
      const rp2 = await (await fetch(url + `/api/v1/explorer/${ router.query.tab }/${ hash }/detail`,
        { method: 'get' })).json() as ExplorerTransactionDetail;
      queryClient?.setQueryData(getResourceKey('tx', { pathParams: { hash } }), {
        ...TX,
        hash: rp1.tx_hash,
        method: rp1.method,
        credential_id: rp1.credential_id && rp1.credential_id?.toString().replace(',', '、'),
        credential_status: rp1.credential_id && rp1.credential_id.map((value, index) => {
          return {
            credential_id: value,
            credential_status: rp1.credential_status[index],
            expiration_date: rp1.expiration_date[index],
          };
        }),
        SchemaID: rp1.scheme_id?.length ? rp1.scheme_id[0] : '/',
        block_number: rp1.block_number,
        confirmations: rp1.block_confirmations,
        transaction_status: rp1.transaction_status,
        from: {
          ...TX.from,
          hash: rp1.from_address,
        },
        to: {
          ...TX.to,
          hash: rp1.to_address,
          name: 'MOCA Chain',
        },
        fee: {
          value: rp1.tx_fee,
        },
        timestamp: rp1.tx_time,
        value: rp1.tx_value,
        gas_price: rp1.gas_price,
        gas_used: rp1.gas_used,
        gas_limit: rp1.gas_limit,
        base_fee_per_gas: rp1.gas_base,
        max_fee_per_gas: rp1.max_fee_per_gas,
        max_priority_fee_per_gas: rp1.max_priority_fee_per_gas,
        confirmation_duration: [
          0,
          rp1.confirmed_within,
        ],
        type: Number(rp2.tx_type.slice(0, 1)),
        nonce: rp2.nonce,
        position: rp2.transaction_index,
        raw_input: rp2.raw_input,
        zilliqa: {
          is_scilla: false,
        },
        decoded_input: {
          method_call: rp2.fn_signature,
          method_id: rp2.method_id,
          parameters: rp2.fn_params && JSON.parse(rp2.fn_params),
        },
      });
    } catch (error: unknown) {
      throw new Error(String(error));
    }
  }, [ requestFlag, url, hash, queryClient, router.query.tab ]);

  React.useEffect(() => {
    if ((router.query.tab === 'issuance' || router.query.tab === 'verification') && !requestFlag) {
      setTimeout(() => {
        request();
      }, 500);
    }
  }, [ request, router.query.tab, requestFlag ]);

  const handleStatusUpdateMessage: SocketMessage.TxStatusUpdate['handler'] = React.useCallback(async() => {
    await delay(5 * SECOND);
    queryClient.invalidateQueries({
      queryKey: getResourceKey('tx', { pathParams: { hash } }),
    });
  }, [ queryClient, hash ]);

  const handleSocketClose = React.useCallback(() => {
    setSocketStatus('close');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketStatus('error');
  }, []);
  const locationHrefFlag = location.href.includes('localhost') || location.href.includes('testint');

  const channel = useSocketChannel({
    topic: `transactions:${ hash }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: (isPending || isPlaceholderData || isError || data.status !== null) && !locationHrefFlag,
  });
  useSocketMessage({
    channel,
    event: 'collated',
    handler: handleStatusUpdateMessage,
  });

  return React.useMemo(() => ({
    ...queryResult,
    socketStatus,
    setRefetchOnError: setRefetchEnabled,
  }), [ queryResult, socketStatus, setRefetchEnabled ]);
}
