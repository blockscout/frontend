import { Flex } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import type { AllowanceType } from '../lib/types';

import essentialDappsChains from 'configs/essentialDappsChains';
import { Button } from 'toolkit/chakra/button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableRow, TableCell } from 'toolkit/chakra/table';
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

export default function ApprovalsTableItem({
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
    <TableRow fontWeight="500" css={{ '& > td': { verticalAlign: 'middle' } }}>
      <TableCell>
        <Flex flexDir="column" gap={ 2 } mr={ 2 }>
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
            jointSymbol
            textStyle="sm"
            fontWeight="600"
            href={ `${ essentialDappsChains[selectedChainId] }/token/${ approval.address }` }
            isExternal
            link={{ noIcon: true }}
          />
          <AddressEntity
            address={{ hash: approval.address }}
            truncation="constant"
            noIcon
            isLoading={ isLoading }
            href={ `${ essentialDappsChains[selectedChainId] }/token/${ approval.address }` }
            isExternal
            link={{ variant: 'secondary', noIcon: true }}
          />
        </Flex>
      </TableCell>
      <TableCell>
        <AddressEntity
          address={{ hash: approval.spender }}
          truncation="constant"
          noIcon
          isLoading={ isLoading }
          href={ `${ essentialDappsChains[selectedChainId] }/address/${ approval.spender }` }
          isExternal
          link={{ noIcon: true }}
        />
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">
          <NumberEntity
            value={ allowance }
            postfix={
              [ 'Unlimited', 'N/A' ].includes(allowance) ? '' : approval.symbol
            }
          />
        </Skeleton>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">
          { approval.valueAtRiskUsd && (
            <NumberEntity
              value={ approval.valueAtRiskUsd.toString() }
              suffix="$"
            />
          ) }
        </Skeleton>
      </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } display="inline-block">
          <DateEntity value={ approval.timestamp }/>
        </Skeleton>
      </TableCell>
      { isAddressMatch && (
        <TableCell isNumeric>
          <Button
            size="sm"
            variant="outline"
            loading={ isLoading || isTxLoading || isPending }
            onClick={ handleRevoke }
          >
            Revoke
          </Button>
        </TableCell>
      ) }
    </TableRow>
  );
}
