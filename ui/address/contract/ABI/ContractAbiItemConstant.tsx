import { Button, Checkbox, Flex, Spinner, chakra } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import type { ChangeEvent } from 'react';
import React from 'react';
import { getAddress } from 'viem';
import { usePublicClient } from 'wagmi';

import type { SmartContractMethodRead } from '../types';

import { WEI } from 'lib/consts';
import delay from 'lib/delay';
import { currencyUnits } from 'lib/units';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import useAccount from 'lib/web3/useAccount';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import { matchInt } from './form/utils';

function castValueToString(value: unknown): string {
  switch (typeof value) {
    case 'string':
      return value;
    case 'boolean':
      return String(value);
    case 'undefined':
      return '';
    case 'number':
      return value.toLocaleString(undefined, { useGrouping: false });
    case 'bigint':
      return value.toString();
    case 'object':
      return JSON.stringify(value, undefined, 2);
    default:
      return String(value);
  }
}

interface Props {
  data: SmartContractMethodRead;
  addressHash: string;
  isOpen: boolean;
}

const ContractAbiItemConstant = ({ data, addressHash, isOpen }: Props) => {
  const [ isChecked, setIsChecked ] = React.useState(false);

  const publicClient = usePublicClient();
  const { address: account } = useAccount();

  const query = useQuery<unknown, unknown, string>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [ 'read-contract', addressHash, data.method_id ],
    queryFn: async() => {
      // TODO @tom2drum remove delay
      await delay(1_000);
      return publicClient?.readContract({
        abi: [ data ],
        functionName: data.name,
        args: undefined,
        address: addressHash as `0x${ string }`,
        account,
      });
    },
    select: castValueToString,
    refetchOnMount: false,
    enabled: isOpen,
  });

  const intMatch = matchInt(data.outputs[0].type);

  const handleCheckboxChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  }, [ ]);

  const handleRefetchClick = React.useCallback(() => {
    query.refetch();
  }, [ query ]);

  const value = (() => {
    if (query.isLoading) {
      return <Spinner size="sm"/>;
    }

    if (typeof query.data === 'string' && ADDRESS_REGEXP.test(query.data)) {
      return (
        <AddressEntity
          address={{ hash: getAddress(query.data) }}
          noIcon
        />
      );
    }

    const value = isChecked && query.data ? BigNumber(query.data).div(WEI).toFixed() : query.data;

    return value;
  })();

  const type = data.outputs.map(({ type }) => type).join(', ');

  return (
    <Flex columnGap={ 2 } rowGap={ 2 } alignItems="center" flexWrap="wrap">
      <chakra.span wordBreak="break-all" whiteSpace="pre-wrap">
        ({ type }):
      </chakra.span>
      { value }
      { !query.isLoading && Number(intMatch?.power) >= 128 && (
        <Checkbox onChange={ handleCheckboxChange } isChecked={ isChecked }>
          { isChecked ? currencyUnits.ether.toUpperCase() : currencyUnits.wei.toUpperCase() }
        </Checkbox>
      ) }
      { !query.isLoading && (
        <Button
          size="xs"
          variant="outline"
          ml={ 2 }
          onClick={ handleRefetchClick }
          loadingText="Refetch"
          isLoading={ query.isRefetching }
        >
          Refetch
        </Button>
      ) }
    </Flex>
  );
};

export default ContractAbiItemConstant;
