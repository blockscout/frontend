import { Stat, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';
import type { ClusterChainConfig } from 'types/multichain';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ZERO } from 'toolkit/utils/consts';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import TokenValue from 'ui/shared/value/TokenValue';
import { WEI_DECIMALS } from 'ui/shared/value/utils';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
  chainData?: ClusterChainConfig;
};

const AddressCoinBalanceListItem = (props: Props) => {
  const decimals = Number(props.token?.decimals ?? WEI_DECIMALS);
  const deltaBn = BigNumber(props.delta).div(BigNumber(10).pow(decimals));
  const isPositiveDelta = deltaBn.gte(ZERO);
  const value = props.token ? (
    <TokenValue
      token={ props.token }
      amount={ props.value }
      loading={ props.isLoading }
      fontWeight={ 600 }
      maxW="100%"
    />
  ) : (
    <NativeCoinValue
      amount={ props.value }
      loading={ props.isLoading }
      fontWeight={ 600 }
      maxW="100%"
    />
  );
  const asset = props.token ? (
    <TokenEntity
      token={ props.token }
      isLoading={ props.isLoading }
      fontWeight={ 700 }
      maxW="180px"
    />
  ) : (
    <Flex alignItems="center" columnGap={ 2 } minW={ 0 }>
      <NativeTokenIcon boxSize={ 5 } isLoading={ props.isLoading }/>
      <Skeleton loading={ props.isLoading } fontWeight={ 700 } overflow="hidden" textOverflow="ellipsis">
        { currencyUnits.ether }
      </Skeleton>
    </Flex>
  );

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%" columnGap={ 3 } alignItems="flex-start">
        <Flex minW={ 0 } maxW="64%">
          { value }
        </Flex>
        <Flex flexShrink={ 0 } maxW="36%" justifyContent="flex-end">
          <Skeleton loading={ props.isLoading } maxW="100%" overflow="hidden">
            <Stat.Root
              display="inline-flex"
              alignItems="center"
              maxW="100%"
              flexGrow="0"
              colorPalette={ isPositiveDelta ? 'green' : 'red' }
              size="sm"
            >
              <Stat.ValueText fontWeight={ 600 } maxW="100%" overflow="hidden">
                <SimpleValue
                  value={ deltaBn }
                  loading={ props.isLoading }
                />
              </Stat.ValueText>
              { isPositiveDelta ? <Stat.UpIndicator/> : <Stat.DownIndicator/> }
            </Stat.Root>
          </Skeleton>
        </Flex>
      </Flex>
      <Flex columnGap={ 2 } w="100%" alignItems="center" minW={ 0 }>
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Asset</Skeleton>
        <Flex minW={ 0 }>
          { asset }
        </Flex>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Block</Skeleton>
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.block_number }
          noIcon={ !props.chainData }
          fontWeight={ 700 }
          chain={ props.chainData }
        />
      </Flex>
      { props.transaction_hash && (
        <Flex columnGap={ 2 } w="100%" minW={ 0 }>
          <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txs</Skeleton>
          <TxEntity
            hash={ props.transaction_hash }
            isLoading={ props.isLoading }
            noIcon
            fontWeight={ 700 }
            maxW="150px"
          />
        </Flex>
      ) }
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Age</Skeleton>
        <TimeWithTooltip
          timestamp={ props.block_timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
        />
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(AddressCoinBalanceListItem);
