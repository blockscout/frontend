import { Box, Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';

import config from 'configs/app';
import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import { currencyUnits } from 'lib/units';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import HashStringShorten from 'ui/shared/HashStringShorten';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

interface Props {
  data: VerifiedContract;
  isLoading?: boolean;
}

const VerifiedContractsListItem = ({ data, isLoading }: Props) => {
  const balance = data.coin_balance && data.coin_balance !== '0' ?
    BigNumber(data.coin_balance).div(10 ** config.chain.currency.decimals).dp(6).toFormat() :
    '0';

  const license = (() => {
    const license = CONTRACT_LICENSES.find((license) => license.type === data.license_type);
    if (!license || license.type === 'none') {
      return '-';
    }

    return license.label;
  })();

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex w="100%">
        <Flex alignItems="center" overflow="hidden">
          <AddressEntity
            isLoading={ isLoading }
            address={ data.address }
            query={{ tab: 'contract' }}
            noCopy
          />
          { data.certified && <ContractCertifiedLabel iconSize={ 5 } boxSize={ 5 } mx={ 2 }/> }
        </Flex>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" ml="auto">
          <HashStringShorten hash={ data.address.hash } isTooltipDisabled/>
        </Skeleton>
        <CopyToClipboard text={ data.address.hash } isLoading={ isLoading }/>
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Balance { currencyUnits.ether }</Skeleton>
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
      { data.zk_compiler_version && (
        <Flex columnGap={ 3 }>
          <Skeleton isLoaded={ !isLoading } fontWeight={ 500 } flexShrink="0">ZK compiler</Skeleton>
          <Skeleton isLoaded={ !isLoading } color="text_secondary" wordBreak="break-all" whiteSpace="pre-wrap">
            { data.zk_compiler_version }
          </Skeleton>
        </Flex>
      ) }
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Optimization</Skeleton>
        { data.optimization_enabled ?
          <IconSvg name="check" boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
          <IconSvg name="cross" boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Constructor args</Skeleton>
        { data.has_constructor_args ?
          <IconSvg name="check" boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
          <IconSvg name="cross" boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Verified</Skeleton>
        <Flex alignItems="center" columnGap={ 2 }>
          <IconSvg name="status/success" boxSize={ 4 } color="green.500" isLoading={ isLoading }/>
          <TimeAgoWithTooltip
            timestamp={ data.verified_at }
            isLoading={ isLoading }
            color="text_secondary"
          />
        </Flex>
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>License</Skeleton>
        <Skeleton isLoaded={ !isLoading } color="text_secondary">
          <span>{ license }</span>
        </Skeleton>
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(VerifiedContractsListItem);
