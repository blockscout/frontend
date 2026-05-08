import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressCoinBalanceHistoryResponse } from 'types/api/address';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { ADDRESS_COIN_BALANCE } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import SocketAlert from 'ui/shared/SocketAlert';

import AddressCoinBalanceChart from './coinBalance/AddressCoinBalanceChart';
import AddressCoinBalanceFilter, {
  ALL_ASSETS_FILTER,
  NATIVE_ASSET_FILTER,
  getCoinBalanceFilterValue,
  getUniqueBalanceTokens,
  type AddressCoinBalanceFilterValue,
} from './coinBalance/AddressCoinBalanceFilter';
import AddressCoinBalanceHistory from './coinBalance/AddressCoinBalanceHistory';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
  nativeExchangeRate?: string | null;
};

const AddressCoinBalance = ({ shouldRender = true, isQueryEnabled = true, nativeExchangeRate }: Props) => {
  const [ socketAlert, setSocketAlert ] = React.useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const isMounted = useIsMounted();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const addressHash = getQueryParamString(router.query.hash);
  const [ tokenFilter, setTokenFilter ] = React.useState<AddressCoinBalanceFilterValue>(
    getCoinBalanceFilterValue(getQueryParamString(router.query.token_contract_address_hash)),
  );
  const filters = React.useMemo(
    () => tokenFilter === ALL_ASSETS_FILTER ? undefined : { token_contract_address_hash: tokenFilter },
    [ tokenFilter ],
  );
  const coinBalanceQuery = useQueryWithPages({
    resourceName: 'general:address_coin_balance',
    pathParams: { hash: addressHash },
    filters,
    scrollRef,
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'general:address_coin_balance'>(
        ADDRESS_COIN_BALANCE,
        50,
        {
          next_page_params: {
            block_number: 8009880,
            items_count: 50,
          },
        },
      ),
    },
  });
  const tokenBalancesQuery = useApiQuery('general:address_token_balances', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: isQueryEnabled,
      placeholderData: [],
    },
  });
  const selectedToken = React.useMemo(() => {
    if (tokenFilter === ALL_ASSETS_FILTER || tokenFilter === NATIVE_ASSET_FILTER) {
      return;
    }

    return getUniqueBalanceTokens(tokenBalancesQuery.data).find((token) => token.address_hash.toLowerCase() === tokenFilter.toLowerCase());
  }, [ tokenBalancesQuery.data, tokenFilter ]);

  const handleTokenFilterChange = React.useCallback((nextValue: AddressCoinBalanceFilterValue) => {
    setTokenFilter(nextValue);

    coinBalanceQuery.onFilterChange(
      nextValue === ALL_ASSETS_FILTER ? {} : { token_contract_address_hash: nextValue },
    );
  }, [ coinBalanceQuery ]);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert(true);
  }, []);

  const handleNewSocketMessage: SocketMessage.AddressCoinBalance['handler'] = React.useCallback((payload) => {
    setSocketAlert(false);

    if (tokenFilter !== ALL_ASSETS_FILTER && tokenFilter !== NATIVE_ASSET_FILTER) {
      return;
    }

    queryClient.setQueryData(
      getResourceKey('general:address_coin_balance', {
        pathParams: { hash: addressHash },
        queryParams: filters,
      }),
      (prevData: AddressCoinBalanceHistoryResponse | undefined) => {
        if (!prevData) {
          return;
        }

        return {
          ...prevData,
          items: [
            payload.coin_balance,
            ...prevData.items,
          ],
        };
      });
  }, [ addressHash, filters, queryClient, tokenFilter ]);

  const channel = useSocketChannel({
    topic: `addresses:${ addressHash.toLowerCase() }`,
    onSocketClose: handleSocketError,
    onSocketError: handleSocketError,
    isDisabled: !addressHash || coinBalanceQuery.isPlaceholderData || coinBalanceQuery.pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'coin_balance',
    handler: handleNewSocketMessage,
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  return (
    <>
      { socketAlert && <SocketAlert mb={ 6 }/> }
      <AddressCoinBalanceFilter
        value={ tokenFilter }
        tokenBalances={ tokenBalancesQuery.data }
        isLoading={ tokenBalancesQuery.isPlaceholderData }
        onChange={ handleTokenFilterChange }
      />
      { tokenFilter !== ALL_ASSETS_FILTER && (
        <AddressCoinBalanceChart addressHash={ addressHash } tokenFilter={ tokenFilter } token={ selectedToken }/>
      ) }
      <div ref={ scrollRef }></div>
      <AddressCoinBalanceHistory query={ coinBalanceQuery } nativeExchangeRate={ nativeExchangeRate }/>
    </>
  );
};

export default React.memo(AddressCoinBalance);
