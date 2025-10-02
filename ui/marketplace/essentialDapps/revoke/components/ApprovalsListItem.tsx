import { Flex, Text } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { AllowanceType } from '../lib/types';

import essentialDappsChains from 'configs/essentialDappsChains';
import { Button } from 'toolkit/chakra/button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

import useRevoke from '../hooks/useRevoke';
import formatAllowance from '../lib/formatAllowance';
import DateEntity from './DateEntity';
import NumberEntity from './NumberEntity';

type Props = {
  selectedChainId: number;
  approval: AllowanceType;
  isLoading?: boolean;
  isAddressMatch?: boolean;
};

export default function ApprovalsListItem({
  selectedChainId,
  approval,
  isLoading,
  isAddressMatch,
}: Props) {
  const { revoke, isError, isLoading: isTxLoading } = useRevoke(approval, selectedChainId);
  const [ isPending, setIsPending ] = useState(false);

  const allowance = formatAllowance(approval);

  const handleRevoke = useCallback(async() => {
    setIsPending(true);
    await revoke();
    setIsPending(false);
  }, [ revoke ]);

  return (
    <Flex
      flexDir="column"
      textStyle="sm"
      fontWeight="500"
      gap={ 3 }
      pb={ 4 }
      mb={ 4 }
      borderBottom="1px solid"
      borderColor="border.divider"
    >
      <Flex>
        <Flex flex="1">
          <Text>Token</Text>
        </Flex>
        <Flex flex="1" flexDir="column" gap={ 2 }>
          <TokenEntity
            token={{
              address_hash: approval.address,
              type: approval.type,
              symbol: approval.symbol || null,
              name: approval.name || null,
              icon_url: approval.tokenIcon || null,
            }}
            isLoading={ isLoading }
            noCopy
            noLink
          />
          <AddressEntity
            address={{ hash: approval.address }}
            truncation="constant"
            noIcon
            isLoading={ isLoading }
            href={ `${ essentialDappsChains[selectedChainId] }/token/${ approval.address }` }
          />
        </Flex>
      </Flex>
      <Flex>
        <Flex flex="1">
          <Text>Approved spender</Text>
        </Flex>
        <Flex flex="1">
          <AddressEntity
            address={{ hash: approval.spender }}
            truncation="constant"
            noIcon
            isLoading={ isLoading }
          />
        </Flex>
      </Flex>
      <Flex>
        <Flex flex="1">
          <Text>Approved amount</Text>
        </Flex>
        <Flex flex="1">
          <Skeleton loading={ isLoading }>
            <NumberEntity
              value={ allowance }
              postfix={
                [ 'Unlimited', 'N/A' ].includes(allowance) ? '' : approval.symbol
              }
            />
          </Skeleton>
        </Flex>
      </Flex>
      <Flex>
        <Flex flex="1">
          <Text>Value at risk</Text>
        </Flex>
        <Flex flex="1">
          <Skeleton loading={ isLoading }>
            { approval.valueAtRiskUsd ? (
              <NumberEntity
                value={ approval.valueAtRiskUsd.toString() }
                suffix="$"
              />
            ) : '-' }
          </Skeleton>
        </Flex>
      </Flex>
      <Flex>
        <Flex flex="1">
          <Text>Last updated</Text>
        </Flex>
        <Flex flex="1">
          <Skeleton loading={ isLoading }>
            <DateEntity value={ approval.timestamp }/>
          </Skeleton>
        </Flex>
      </Flex>
      { isAddressMatch && (
        <Button
          size="sm"
          variant="outline"
          loading={ isLoading || isTxLoading || isPending }
          onClick={ handleRevoke }
          disabled={ isError }
        >
          Revoke
        </Button>
      ) }
    </Flex>
  );
}
