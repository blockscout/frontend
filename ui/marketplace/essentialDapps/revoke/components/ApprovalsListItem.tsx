import { Text } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { AllowanceType } from 'types/client/revoke';
import type { ChainConfig } from 'types/multichain';

import { route } from 'nextjs/routes';

import dayjs from 'lib/date/dayjs';
import { Button } from 'toolkit/chakra/button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
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
    <ListItemMobileGrid.Container
      gridTemplateColumns="minmax(0, 1fr) minmax(0, 1fr)"
      fontWeight="500"
      _first={{
        borderTop: 0,
        paddingTop: 0,
      }}
      _last={{
        borderBottom: 0,
        paddingBottom: 0,
      }}
    >
      <ListItemMobileGrid.Label isLoading={ isLoading }>Token</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value display="flex" flexDir="column" gap={ 2 } color="inherit">
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
          jointSymbol
          href={ selectedChain?.config.app.baseUrl + route({ pathname: '/token/[hash]', query: { hash: approval.address } }) }
          link={{ noIcon: true, external: true }}
        />
        <AddressEntity
          address={{ hash: approval.address }}
          truncation="constant"
          noIcon
          isLoading={ isLoading }
          href={ selectedChain?.config.app.baseUrl + route({ pathname: '/address/[hash]', query: { hash: approval.address } }) }
          link={{ noIcon: true, external: true }}
        />
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Approved spender</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{ hash: approval.spender }}
          truncation="constant"
          noIcon
          isLoading={ isLoading }
          href={ selectedChain?.config.app.baseUrl + route({ pathname: '/address/[hash]', query: { hash: approval.spender } }) }
          link={{ noIcon: true, external: true }}
        />
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Approved amount</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="inherit">
        <Skeleton loading={ isLoading }>
          <NumberEntity
            value={ allowance }
            postfix={
              [ 'Unlimited', 'N/A' ].includes(allowance) ? '' : approval.symbol
            }
          />
        </Skeleton>
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Value at risk</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="inherit">
        <Skeleton loading={ isLoading }>
          { approval.valueAtRiskUsd ? (
            <NumberEntity
              value={ approval.valueAtRiskUsd.toString() }
              suffix="$"
            />
          ) : '-' }
        </Skeleton>
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Last updated</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="inherit">
        <Skeleton loading={ isLoading } display="flex" flexDir="column" rowGap={ 2 }>
          <Text>{ dayjs(approval.timestamp).format('lll') }</Text>
          <Text>{ dayjs(approval.timestamp).fromNow() }</Text>
        </Skeleton>
      </ListItemMobileGrid.Value>
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
    </ListItemMobileGrid.Container>
  );
}
