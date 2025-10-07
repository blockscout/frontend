import { Flex, Text, Grid } from '@chakra-ui/react';
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
  const { revoke, isLoading: isTxLoading } = useRevoke(approval, selectedChainId);
  const [ isPending, setIsPending ] = useState(false);

  const allowance = formatAllowance(approval);

  const handleRevoke = useCallback(async() => {
    setIsPending(true);
    await revoke();
    setIsPending(false);
  }, [ revoke ]);

  return (
    <Grid
      templateColumns="minmax(0, 1fr) minmax(0, 1fr)"
      rowGap={ 3 }
      pb={ 4 }
      mb={ 4 }
      borderBottom="1px solid"
      borderColor="border.divider"
      textStyle="sm"
      fontWeight="500"
    >
      <Text>Token</Text>
      <Flex flexDir="column" gap={ 2 }>
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
      <Text>Approved spender</Text>
      <AddressEntity
        address={{ hash: approval.spender }}
        truncation="constant"
        noIcon
        isLoading={ isLoading }
      />
      <Text>Approved amount</Text>
      <Skeleton loading={ isLoading }>
        <NumberEntity
          value={ allowance }
          postfix={
            [ 'Unlimited', 'N/A' ].includes(allowance) ? '' : approval.symbol
          }
        />
      </Skeleton>
      <Text>Value at risk</Text>
      <Skeleton loading={ isLoading }>
        { approval.valueAtRiskUsd ? (
          <NumberEntity
            value={ approval.valueAtRiskUsd.toString() }
            suffix="$"
          />
        ) : '-' }
      </Skeleton>
      <Text>Last updated</Text>
      <Skeleton loading={ isLoading }>
        <DateEntity value={ approval.timestamp }/>
      </Skeleton>
      { isAddressMatch && (
        <Button
          size="sm"
          variant="outline"
          loading={ isLoading || isTxLoading || isPending }
          onClick={ handleRevoke }
          gridColumn="span 2"
        >
          Revoke
        </Button>
      ) }
    </Grid>
  );
}
