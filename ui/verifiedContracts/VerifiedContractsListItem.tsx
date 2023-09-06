import { Box, Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';

import config from 'configs/app';
import iconCheck from 'icons/check.svg';
import iconCross from 'icons/cross.svg';
import iconSuccess from 'icons/status/success.svg';
import dayjs from 'lib/date/dayjs';
import Icon from 'ui/shared/chakra/Icon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import HashStringShorten from 'ui/shared/HashStringShorten';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface Props {
  data: VerifiedContract;
  isLoading?: boolean;
}

const VerifiedContractsListItem = ({ data, isLoading }: Props) => {
  const balance = data.coin_balance && data.coin_balance !== '0' ?
    BigNumber(data.coin_balance).div(10 ** config.chain.currency.decimals).dp(6).toFormat() :
    '0';

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex w="100%">
        <AddressEntity
          isLoading={ isLoading }
          address={ data.address }
          query={{ tab: 'contract' }}
          noCopy
        />
        <Skeleton isLoaded={ !isLoading } color="text_secondary" ml="auto">
          <HashStringShorten hash={ data.address.hash } isTooltipDisabled/>
        </Skeleton>
        <CopyToClipboard text={ data.address.hash } isLoading={ isLoading }/>
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Balance { config.chain.currency.symbol }</Skeleton>
        <Skeleton isLoaded={ !isLoading } color="text_secondary">
          <span>{ balance }</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Txs count</Skeleton>
        <Skeleton isLoaded={ !isLoading } color="text_secondary">
          <span>{ data.tx_count ? data.tx_count.toLocaleString() : '0' }</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 } flexShrink="0">Compiler</Skeleton>
        <Skeleton isLoaded={ !isLoading } display="flex" flexWrap="wrap">
          <Box textTransform="capitalize">{ data.language }</Box>
          <Box color="text_secondary" wordBreak="break-all" whiteSpace="pre-wrap"> ({ data.compiler_version })</Box>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Optimization</Skeleton>
        { data.optimization_enabled ?
          <Icon as={ iconCheck } boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
          <Icon as={ iconCross } boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Constructor args</Skeleton>
        { data.has_constructor_args ?
          <Icon as={ iconCheck } boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
          <Icon as={ iconCross } boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Verified</Skeleton>
        <Flex alignItems="center" columnGap={ 2 }>
          <Icon as={ iconSuccess } boxSize={ 4 } color="green.500" isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } color="text_secondary">
            <span>{ dayjs(data.verified_at).fromNow() }</span>
          </Skeleton>
        </Flex>
      </Flex>
      { /* <Flex columnGap={ 3 }>
        <Box fontWeight={ 500 }>Market cap</Box>
        <Box color="text_secondary">
          N/A
        </Box>
      </Flex> */ }
    </ListItemMobile>
  );
};

export default React.memo(VerifiedContractsListItem);
