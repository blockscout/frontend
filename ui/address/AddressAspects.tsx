import AspectABI from 'aspect/abi/aspect.json';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React from 'react';

import chain from 'configs/app/chain';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_COIN_BALANCE } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressAspectsHistory from './aspects/AddressAspectsHistory';

export type AspectType = {
  aspectId?: string;
  version?: number;
  priority?: number;
  joinPoints?: number;
};
const AddressAspects = () => {
  const router = useRouter();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [ aspectList, setAspectList ] = React.useState<Array<Array<AspectType>>>([]);
  const addressHash = getQueryParamString(router.query.hash);
  const provider = React.useMemo(() => {
    return new ethers.JsonRpcProvider(chain.rpcUrl);
  }, []);
  const contract = React.useMemo(() => {
    return new ethers.Contract(chain.aspectAddress, AspectABI, provider);
  }, [ provider ]);
  const chunkArray = (arr: Array<AspectType>, chunkSize: number) => {
    const result = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }

    return result;
  };
  const getAspectsList = React.useCallback(async(addressHash: string) => {
    const res = await contract.aspectsOf(addressHash);
    const data = chunkArray(res.map((item: AspectType) => {
      return {
        aspectId: item.aspectId,
        version: item.version,
        priority: item.priority,
      };
    }), 10);

    setAspectList(data);
  }, [ contract ]);

  React.useEffect(() => {
    getAspectsList(addressHash);
  }, [ addressHash, getAspectsList ]);
  const coinBalanceQuery = useQueryWithPages({
    resourceName: 'address_coin_balance',
    pathParams: { hash: addressHash },
    scrollRef,
    options: {
      placeholderData: generateListStub<'address_coin_balance'>(
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

  return (
    <AddressAspectsHistory query={ coinBalanceQuery } aspectList={ aspectList }/>
  );
};

export default React.memo(AddressAspects);
