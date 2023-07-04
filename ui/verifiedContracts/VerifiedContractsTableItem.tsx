import { Tr, Td, Flex, chakra, Tooltip, Skeleton } from '@chakra-ui/react';
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
import Icon from 'ui/shared/chakra/Icon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';

interface Props {
  data: VerifiedContract;
  isLoading?: boolean;
}

const VerifiedContractsTableItem = ({ data, isLoading }: Props) => {
  const balance = data.coin_balance && data.coin_balance !== '0' ?
    BigNumber(data.coin_balance).div(10 ** appConfig.network.currency.decimals).dp(6).toFormat() :
    '0';

  return (
    <Tr>
      <Td>
        <Flex columnGap={ 2 }>
          <AddressIcon address={ data.address } isLoading={ isLoading }/>
          <Flex columnGap={ 2 } flexWrap="wrap" w="calc(100% - 32px)">
            <AddressLink hash={ data.address.hash } type="address" alias={ data.address.name } isLoading={ isLoading } my={ 1 } query={{ tab: 'contract' }}/>
            <Flex alignItems="center">
              <Skeleton isLoaded={ !isLoading } color="text_secondary" my={ 1 }>
                <HashStringShorten hash={ data.address.hash } isTooltipDisabled/>
              </Skeleton>
              <CopyToClipboard text={ data.address.hash } isLoading={ isLoading }/>
            </Flex>
          </Flex>
        </Flex>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block" my={ 1 }>
          { balance }
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block" my={ 1 }>
          { data.tx_count ? data.tx_count.toLocaleString() : '0' }
        </Skeleton>
      </Td>
      <Td>
        <Flex flexWrap="wrap" columnGap={ 2 }>
          <Skeleton isLoaded={ !isLoading } textTransform="capitalize" my={ 1 }>{ data.language }</Skeleton>
          <Skeleton isLoaded={ !isLoading } color="text_secondary" wordBreak="break-all" my={ 1 }>
            <span>{ data.compiler_version }</span>
          </Skeleton>
        </Flex>
      </Td>
      <Td>
        <Tooltip label={ isLoading ? undefined : 'Optimization' }>
          <chakra.span display="inline-block">
            { data.optimization_enabled ?
              <Icon as={ iconCheck } boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
              <Icon as={ iconCross } boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
          </chakra.span>
        </Tooltip>
        <Tooltip label={ isLoading ? undefined : 'Constructor args' }>
          <chakra.span display="inline-block" ml={ 3 }>
            { data.has_constructor_args ?
              <Icon as={ iconCheck } boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
              <Icon as={ iconCross } boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
          </chakra.span>
        </Tooltip>
      </Td>
      <Td>
        <Flex alignItems="center" columnGap={ 2 } my={ 1 }>
          <Icon as={ iconSuccess } boxSize={ 4 } color="green.500" isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } color="text_secondary">
            <span>{ dayjs(data.verified_at).fromNow() }</span>
          </Skeleton>
        </Flex>
      </Td>
      { /* <Td>
        N/A
      </Td> */ }
    </Tr>
  );
};

export default React.memo(VerifiedContractsTableItem);
