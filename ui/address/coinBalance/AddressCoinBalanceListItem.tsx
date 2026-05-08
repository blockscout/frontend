import { Stat, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ZERO } from 'toolkit/utils/consts';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import SimpleValue from 'ui/shared/value/SimpleValue';
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
  const ticker = props.token?.symbol || currencyUnits.ether;
  const asset = props.token ? (
    <TokenEntity
      token={ props.token }
      isLoading={ props.isLoading }
      fontWeight={ 700 }
      maxW="100%"
      noCopy
    />
  ) : (
    <Flex alignItems="center" columnGap={ 2 } minW={ 0 }>
      <NativeTokenIcon boxSize={ 5 } isLoading={ props.isLoading }/>
      <Skeleton loading={ props.isLoading } fontWeight={ 700 } overflow="hidden" textOverflow="ellipsis">
        { config.chain.currency.name || currencyUnits.ether }
      </Skeleton>
    </Flex>
  );

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex w="100%" minW={ 0 }>
        <Skeleton loading={ props.isLoading } maxW="100%" overflow="hidden">
          <Stat.Root
            display="inline-flex"
            alignItems="center"
            maxW="100%"
            flexGrow="0"
            colorPalette={ isPositiveDelta ? 'green' : 'red' }
            size="sm"
          >
            { isPositiveDelta ? <Stat.UpIndicator flexShrink={ 0 }/> : <Stat.DownIndicator flexShrink={ 0 }/> }
            <Stat.ValueText fontWeight={ 600 } maxW="100%" overflow="hidden" display="inline-flex" columnGap={ 1 }>
              <SimpleValue
                value={ deltaBn }
                loading={ props.isLoading }
              />
              <Skeleton loading={ props.isLoading } flexShrink={ 0 }>
                { ticker }
              </Skeleton>
            </Stat.ValueText>
          </Stat.Root>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 } w="100%" alignItems="center" minW={ 0 }>
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Asset</Skeleton>
        <Flex minW={ 0 } flex="1">
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
          <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txid</Skeleton>
          <TxEntity
            hash={ props.transaction_hash }
            isLoading={ props.isLoading }
            noIcon
            fontWeight={ 700 }
            maxW="100%"
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
