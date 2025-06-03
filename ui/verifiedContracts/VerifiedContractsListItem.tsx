import { Box, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';

import config from 'configs/app';
import formatLanguageName from 'lib/contracts/formatLanguageName';
import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TruncatedValue from 'ui/shared/TruncatedValue';

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
        <AddressEntity
          address={{ hash: data.address.filecoin?.robust ?? data.address.hash }}
          isLoading={ isLoading }
          noLink
          noIcon
          truncation="constant"
          ml="auto"
          linkVariant="secondary"
          flexShrink={ 0 }
        />
      </Flex>
      <Flex columnGap={ 3 } w="100%">
        <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink="0">Balance { currencyUnits.ether }</Skeleton>
        <TruncatedValue
          value={ balance }
          isLoading={ isLoading }
        />
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>Txs count</Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">
          <span>{ data.transactions_count ? data.transactions_count.toLocaleString() : '0' }</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink="0">Language</Skeleton>
        <Skeleton loading={ isLoading } display="flex" flexWrap="wrap">
          <Box>{ formatLanguageName(data.language) }</Box>
          <Box color="text.secondary" wordBreak="break-all" whiteSpace="pre-wrap"> ({ data.compiler_version })</Box>
        </Skeleton>
      </Flex>
      { data.zk_compiler_version && (
        <Flex columnGap={ 3 }>
          <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink="0">ZK compiler</Skeleton>
          <Skeleton loading={ isLoading } color="text.secondary" wordBreak="break-all" whiteSpace="pre-wrap">
            { data.zk_compiler_version }
          </Skeleton>
        </Flex>
      ) }
      <Flex columnGap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>Optimization</Skeleton>
        { data.optimization_enabled ?
          <IconSvg name="check" boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
          <IconSvg name="cross" boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>Constructor args</Skeleton>
        { data.has_constructor_args ?
          <IconSvg name="check" boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
          <IconSvg name="cross" boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>Verified</Skeleton>
        <Flex alignItems="center" columnGap={ 2 }>
          <IconSvg name="status/success" boxSize={ 4 } color="green.500" isLoading={ isLoading }/>
          <TimeWithTooltip
            timestamp={ data.verified_at }
            isLoading={ isLoading }
            color="text.secondary"
          />
        </Flex>
      </Flex>
      <Flex columnGap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>License</Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">
          <span>{ license }</span>
        </Skeleton>
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(VerifiedContractsListItem);
