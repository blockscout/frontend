import { Flex, Text, Grid } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { AllowanceType } from 'types/client/revoke';
import type { ChainConfig } from 'types/multichain';

import { route } from 'nextjs/routes';

import dayjs from 'lib/date/dayjs';
import { Button } from 'toolkit/chakra/button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import NumberEntity from 'ui/shared/NumberEntity';

import useRevoke from '../hooks/useRevoke';
import formatAllowance from '../lib/formatAllowance';

type Props = {
  selectedChain: ChainConfig | undefined;
  approval: AllowanceType;
  isLoading?: boolean;
  isAddressMatch?: boolean;
  hideApproval: (approval: AllowanceType) => void;
};

export default function ApprovalsListItem({
  selectedChain,
  approval,
  isLoading,
  isAddressMatch,
  hideApproval,
}: Props) {
  const revoke = useRevoke();
  const [ isPending, setIsPending ] = useState(false);

  const allowance = formatAllowance(approval);

  const handleRevoke = useCallback(async() => {
    setIsPending(true);
    const success = await revoke(approval, Number(selectedChain?.config.chain.id));
    if (success) {
      hideApproval(approval);
    }
    setIsPending(false);
  }, [ revoke, hideApproval, approval, selectedChain?.config.chain.id ]);

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
            reputation: approval.tokenReputation,
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
          href={ selectedChain?.config.app.baseUrl + route({ pathname: '/token/[hash]', query: { hash: approval.address } }) }
          isExternal
          link={{ noIcon: true }}
        />
      </Flex>
      <Text>Approved spender</Text>
      <AddressEntity
        address={{ hash: approval.spender }}
        truncation="constant"
        noIcon
        isLoading={ isLoading }
        href={ selectedChain?.config.app.baseUrl + route({ pathname: '/address/[hash]', query: { hash: approval.spender } }) }
        isExternal
        link={{ noIcon: true }}
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
        <Text>{ dayjs(approval.timestamp).format('lll') }</Text>
        <Text>{ dayjs(approval.timestamp).fromNow() }</Text>
      </Skeleton>
      { isAddressMatch && (
        <Button
          size="sm"
          variant="outline"
          loading={ isLoading || isPending }
          onClick={ handleRevoke }
          gridColumn="span 2"
        >
          Revoke
        </Button>
      ) }
    </Grid>
  );
}
