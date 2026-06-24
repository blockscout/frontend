// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import type { AllowanceType } from '../types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import dayjs from 'src/shared/date-and-time/dayjs';
import Time from 'src/shared/date-and-time/Time';
import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';
import NumberEntity from 'src/shared/numbers/NumberEntity';

import { Button } from 'src/toolkit/chakra/button';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import useRevoke from '../hooks/useRevoke';
import formatAllowance from '../lib/formatAllowance';
import formatUsdValue from '../lib/formatUsdValue';

type Props = {
  selectedChain: EssentialDappsChainConfig | undefined;
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
  const revoke = useRevoke(selectedChain);
  const [ isPending, setIsPending ] = useState(false);

  const allowance = formatAllowance(approval);
  const valueAtRiskUsd = formatUsdValue(approval.valueAtRiskUsd);

  const handleRevoke = useCallback(async() => {
    setIsPending(true);
    const success = await revoke(approval);
    if (success) {
      hideApproval(approval);
    }
    setIsPending(false);
  }, [ revoke, hideApproval, approval ]);

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
          chain={ selectedChain }
          link={{ noIcon: true, external: true }}
        />
        <AddressEntity
          address={{ hash: approval.address }}
          truncation="constant"
          noIcon
          isLoading={ isLoading }
          chain={ selectedChain }
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
          chain={ selectedChain }
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
          { valueAtRiskUsd || '-' }
        </Skeleton>
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Last updated</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="inherit">
        <Skeleton loading={ isLoading } display="flex" flexDir="column" rowGap={ 2 }>
          <Time timestamp={ approval.timestamp }/>
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
