// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import type { AllowanceType } from '../types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import NumberEntity from 'src/shared/numbers/NumberEntity';

import { Button } from 'src/toolkit/chakra/button';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableRow, TableCell } from 'src/toolkit/chakra/table';

import useRevoke from '../hooks/useRevoke';
import formatAllowance, { getAllowancePostfix } from '../lib/formatAllowance';
import formatUsdValue from '../lib/formatUsdValue';

type Props = {
  selectedChain: EssentialDappsChainConfig | undefined;
  approval: AllowanceType;
  isLoading?: boolean;
  isAddressMatch?: boolean;
  hideApproval: (approval: AllowanceType) => void;
};

export default function ApprovalsTableItem({
  selectedChain,
  approval,
  isLoading,
  isAddressMatch,
  hideApproval,
}: Props) {
  const revoke = useRevoke(selectedChain);
  const [ isPending, setIsPending ] = useState(false);

  const allowance = formatAllowance(approval);
  const allowancePostfix = getAllowancePostfix(approval, allowance);
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
    <TableRow fontWeight="500">
      <TableCell verticalAlign="middle">
        <Flex flexDir="column" gap={ 2 } mr={ 2 }>
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
            textStyle="sm"
            fontWeight="600"
            chain={ selectedChain }
            link={{ noIcon: true, external: true }}
          />
          <AddressEntity
            address={{ hash: approval.address }}
            truncation="constant"
            noIcon
            isLoading={ isLoading }
            chain={ selectedChain }
            link={{ variant: 'secondary', noIcon: true, external: true }}
          />
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle">
        <AddressEntity
          address={{ hash: approval.spender }}
          truncation="constant"
          noIcon
          isLoading={ isLoading }
          chain={ selectedChain }
          link={{ noIcon: true, external: true }}
        />
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          <NumberEntity
            value={ allowance }
            postfix={ allowancePostfix }
          />
        </Skeleton>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { valueAtRiskUsd || '-' }
        </Skeleton>
      </TableCell>
      <TableCell></TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip timestamp={ approval.timestamp } isLoading={ isLoading }/>
      </TableCell>
      { isAddressMatch && (
        <TableCell isNumeric verticalAlign="middle">
          <Button
            size="sm"
            variant="outline"
            loading={ isLoading || isPending }
            onClick={ handleRevoke }
          >
            Revoke
          </Button>
        </TableCell>
      ) }
    </TableRow>
  );
}
