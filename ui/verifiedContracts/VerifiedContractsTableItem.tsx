import { Tr, Td, Icon, Box, Flex, chakra, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';

import appConfig from 'configs/app/config';
import iconCheck from 'icons/check.svg';
import iconCross from 'icons/cross.svg';
import iconSuccess from 'icons/status/success.svg';
import dayjs from 'lib/date/dayjs';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShorten from 'ui/shared/HashStringShorten';

interface Props {
  data: VerifiedContract;
}

const VerifiedContractsTableItem = ({ data }: Props) => {
  const balance = data.coin_balance && data.coin_balance !== '0' ?
    BigNumber(data.coin_balance).div(10 ** appConfig.network.currency.decimals).dp(6).toFormat() :
    '0';

  return (
    <Tr>
      <Td>
        <Flex columnGap={ 2 }>
          <AddressIcon address={ data.address }/>
          <Flex columnGap={ 2 } flexWrap="wrap" lineHeight={ 6 } w="calc(100% - 32px)">
            <AddressLink hash={ data.address.hash } type="address" alias={ data.address.name }/>
            <Box color="text_secondary">
              <HashStringShorten hash={ data.address.hash } isTooltipDisabled/>
            </Box>
          </Flex>
        </Flex>
      </Td>
      <Td isNumeric lineHeight={ 6 }>
        { balance }
      </Td>
      <Td isNumeric lineHeight={ 6 }>
        { data.tx_count ? data.tx_count.toLocaleString() : '0' }
      </Td>
      <Td lineHeight={ 6 }>
        <Flex flexWrap="wrap" columnGap={ 2 }>
          <chakra.span textTransform="capitalize">{ data.language }</chakra.span>
          <chakra.span color="text_secondary" wordBreak="break-all">{ data.compiler_version }</chakra.span>
        </Flex>
      </Td>
      <Td>
        <Tooltip label="Optimization">
          <span>
            { data.optimization_enabled ?
              <Icon as={ iconCheck } boxSize={ 6 } color="green.500" cursor="pointer"/> :
              <Icon as={ iconCross } boxSize={ 6 } color="red.600" cursor="pointer"/> }
          </span>
        </Tooltip>
        <Tooltip label="Constructor args">
          <chakra.span ml={ 3 }>
            { data.has_constructor_args ?
              <Icon as={ iconCheck } boxSize={ 6 } color="green.500" cursor="pointer"/> :
              <Icon as={ iconCross } boxSize={ 6 } color="red.600" cursor="pointer"/> }
          </chakra.span>
        </Tooltip>
      </Td>
      <Td lineHeight={ 6 }>
        <Flex alignItems="center" columnGap={ 2 }>
          <Icon as={ iconSuccess } boxSize={ 4 } color="green.500"/>
          <chakra.span color="text_secondary">
            { dayjs(data.verified_at).fromNow() }
          </chakra.span>
        </Flex>
      </Td>
      { /* <Td lineHeight={ 6 }>
        N/A
      </Td> */ }
    </Tr>
  );
};

export default React.memo(VerifiedContractsTableItem);
