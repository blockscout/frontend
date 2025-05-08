import { Flex, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';

import config from 'configs/app';
import formatLanguageName from 'lib/contracts/formatLanguageName';
import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tooltip } from 'toolkit/chakra/tooltip';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  data: VerifiedContract;
  isLoading?: boolean;
}

const VerifiedContractsTableItem = ({ data, isLoading }: Props) => {
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
    <TableRow>
      <TableCell>
        <Flex alignItems="center" mt={ 1 }>
          <AddressEntity
            address={ data.address }
            isLoading={ isLoading }
            query={{ tab: 'contract' }}
            noCopy
          />
          { data.certified && <ContractCertifiedLabel iconSize={ 5 } boxSize={ 5 } ml={ 2 }/> }
        </Flex>
        <AddressEntity
          address={{ hash: data.address.filecoin?.robust ?? data.address.hash }}
          isLoading={ isLoading }
          noLink
          noIcon
          truncation="constant"
          my={ 1 }
          ml={ 7 }
          linkVariant="secondary"
          w="fit-content"
        />
      </TableCell>
      <TableCell isNumeric>
        <TruncatedValue
          value={ balance }
          isLoading={ isLoading }
          my={ 1 }
          maxW="100%"
        />
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" my={ 1 }>
          { data.transactions_count ? data.transactions_count.toLocaleString() : '0' }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Flex flexWrap="wrap" columnGap={ 2 }>
          <Skeleton loading={ isLoading } my={ 1 }>{ formatLanguageName(data.language) }</Skeleton>
          { data.compiler_version && (
            <Skeleton loading={ isLoading } color="text.secondary" wordBreak="break-all" my={ 1 } cursor="pointer">
              <Tooltip content={ data.compiler_version }>
                <span>{ data.compiler_version.split('+')[0] }</span>
              </Tooltip>
            </Skeleton>
          ) }
        </Flex>
        { data.zk_compiler_version && (
          <Flex flexWrap="wrap" columnGap={ 2 } my={ 1 }>
            <Skeleton loading={ isLoading } >ZK compiler</Skeleton>
            <Skeleton loading={ isLoading } color="text.secondary" wordBreak="break-all">
              <span>{ data.zk_compiler_version }</span>
            </Skeleton>
          </Flex>
        ) }
      </TableCell>
      <TableCell>
        <Tooltip content="Optimization" disabled={ isLoading }>
          <chakra.span display="inline-block">
            { data.optimization_enabled ?
              <IconSvg name="check" boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
              <IconSvg name="cross" boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
          </chakra.span>
        </Tooltip>
        <Tooltip content="Constructor args" disabled={ isLoading }>
          <chakra.span display="inline-block" ml={ 2 }>
            { data.has_constructor_args ?
              <IconSvg name="check" boxSize={ 6 } color="green.500" cursor="pointer" isLoading={ isLoading }/> :
              <IconSvg name="cross" boxSize={ 6 } color="red.600" cursor="pointer" isLoading={ isLoading }/> }
          </chakra.span>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Flex alignItems="center" columnGap={ 2 } my={ 1 }>
          <IconSvg name="status/success" boxSize={ 4 } color="green.500" isLoading={ isLoading }/>
          <TimeWithTooltip
            timestamp={ data.verified_at }
            isLoading={ isLoading }
            color="text.secondary"
          />
        </Flex>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } my={ 1 } display="inline-block">
          { license }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(VerifiedContractsTableItem);
