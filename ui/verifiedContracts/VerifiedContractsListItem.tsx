import { Box, Flex, Icon } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';

import appConfig from 'configs/app/config';
import iconCheck from 'icons/check.svg';
import iconCross from 'icons/cross.svg';
import iconSuccess from 'icons/status/success.svg';
import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShorten from 'ui/shared/HashStringShorten';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface Props {
  data: VerifiedContract;
}

const VerifiedContractsListItem = ({ data }: Props) => {
  const balance = data.coin_balance && data.coin_balance !== '0' ?
    BigNumber(data.coin_balance).div(10 ** appConfig.network.currency.decimals).dp(6).toFormat() :
    '0';

  return (
    <ListItemMobile rowGap={ 3 }>
      <Address columnGap={ 2 } overflow="hidden" w="100%">
        <AddressIcon address={ data.address }/>
        <AddressLink hash={ data.address.hash } type="address" alias={ data.address.name }/>
        <Box color="text_secondary" ml="auto">
          <HashStringShorten hash={ data.address.hash } isTooltipDisabled/>
        </Box>
      </Address>
      <Flex columnGap={ 3 }>
        <Box fontWeight={ 500 }>Balance { appConfig.network.currency.symbol }</Box>
        <Box color="text_secondary">
          { balance }
        </Box>
      </Flex>
      <Flex columnGap={ 3 }>
        <Box fontWeight={ 500 }>Txs count</Box>
        <Box color="text_secondary">
          { data.tx_count ? data.tx_count.toLocaleString() : '0' }
        </Box>
      </Flex>
      <Flex columnGap={ 3 }>
        <Box fontWeight={ 500 } flexShrink="0">Compiler</Box>
        <Flex flexWrap="wrap">
          <Box textTransform="capitalize">{ data.language }</Box>
          <Box color="text_secondary" wordBreak="break-all" whiteSpace="pre-wrap"> ({ data.compiler_version })</Box>
        </Flex>
      </Flex>
      <Flex columnGap={ 3 }>
        <Box fontWeight={ 500 }>Optimization</Box>
        { data.optimization_enabled ?
          <Icon as={ iconCheck } boxSize={ 6 } color="green.500" cursor="pointer"/> :
          <Icon as={ iconCross } boxSize={ 6 } color="red.600" cursor="pointer"/> }
      </Flex>
      <Flex columnGap={ 3 }>
        <Box fontWeight={ 500 }>Constructor args</Box>
        { data.has_constructor_args ?
          <Icon as={ iconCheck } boxSize={ 6 } color="green.500" cursor="pointer"/> :
          <Icon as={ iconCross } boxSize={ 6 } color="red.600" cursor="pointer"/> }
      </Flex>
      <Flex columnGap={ 3 }>
        <Box fontWeight={ 500 }>Verified</Box>
        <Flex alignItems="center" columnGap={ 2 }>
          <Icon as={ iconSuccess } boxSize={ 4 } color="green.500"/>
          <Box color="text_secondary">
            { dayjs(data.verified_at).fromNow() }
          </Box>
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
