import { Flex, Stat } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';
import type { ClusterChainConfig } from 'types/multichain';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { ZERO } from 'toolkit/utils/consts';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import AssetValue from 'ui/shared/value/AssetValue';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { WEI_DECIMALS } from 'ui/shared/value/utils';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
  chainData?: ClusterChainConfig;
};

const AddressCoinBalanceTableItem = (props: Props) => {
  const decimals = Number(props.token?.decimals ?? WEI_DECIMALS);
  const deltaBn = BigNumber(props.delta).div(BigNumber(10).pow(decimals));
  const isPositiveDelta = deltaBn.gte(ZERO);
  const asset = props.token ? (
    <TokenEntity
      token={ props.token }
      isLoading={ props.isLoading }
      fontWeight={ 700 }
      maxW="160px"
    />
  ) : (
    <Flex alignItems="center" columnGap={ 2 } minW={ 0 }>
      <NativeTokenIcon boxSize={ 5 } isLoading={ props.isLoading }/>
      <Skeleton loading={ props.isLoading } fontWeight={ 700 } overflow="hidden" textOverflow="ellipsis">
        { currencyUnits.ether }
      </Skeleton>
    </Flex>
  );
  const value = props.token ? (
    <AssetValue
      amount={ props.value }
      decimals={ props.token.decimals }
      exchangeRate={ props.token.exchange_rate }
      loading={ props.isLoading }
      color="text.secondary"
      layout="vertical"
      maxW="230px"
      ml="auto"
    />
  ) : (
    <NativeCoinValue
      amount={ props.value }
      noSymbol
      loading={ props.isLoading }
      color="text.secondary"
      maxW="230px"
      ml="auto"
    />
  );

  return (
    <TableRow>
      { props.chainData && (
        <TableCell px={ 2 }>
          <ChainIcon data={ props.chainData } isLoading={ props.isLoading }/>
        </TableCell>
      ) }
      <TableCell overflow="hidden">
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.block_number }
          noIcon
          fontWeight={ 700 }
        />
      </TableCell>
      <TableCell overflow="hidden">
        { props.transaction_hash && (
          <TxEntity
            hash={ props.transaction_hash }
            isLoading={ props.isLoading }
            noIcon
            fontWeight={ 700 }
            maxW="150px"
          />
        ) }
      </TableCell>
      <TableCell overflow="hidden">
        { asset }
      </TableCell>
      <TableCell overflow="hidden">
        <TimeWithTooltip
          timestamp={ props.block_timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
      <TableCell isNumeric pr={ 1 } overflow="hidden">
        <Flex justifyContent="flex-end" maxW="100%" minW={ 0 }>
          { value }
        </Flex>
      </TableCell>
      <TableCell isNumeric overflow="hidden">
        <Flex justifyContent="flex-end" maxW="100%" minW={ 0 }>
          <Skeleton loading={ props.isLoading } maxW="100%" overflow="hidden">
            <Stat.Root
              display="inline-flex"
              alignItems="center"
              maxW="100%"
              flexGrow="0"
              colorPalette={ isPositiveDelta ? 'green' : 'red' }
              size="sm"
            >
              <Stat.ValueText fontWeight={ 600 } maxW="140px" overflow="hidden">
                <SimpleValue
                  value={ deltaBn }
                  loading={ props.isLoading }
                />
              </Stat.ValueText>
              { isPositiveDelta ? <Stat.UpIndicator/> : <Stat.DownIndicator/> }
            </Stat.Root>
          </Skeleton>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressCoinBalanceTableItem);
