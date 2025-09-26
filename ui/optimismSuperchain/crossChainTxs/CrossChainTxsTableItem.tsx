import { Spinner, VStack } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TransactionType } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import multichainConfig from 'configs/multichain';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Badge } from 'toolkit/chakra/badge';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import CrossChainTxStatusTag from 'ui/optimismSuperchain/components/CrossChainTxStatusTag';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TxType from 'ui/txs/TxType';

interface Props {
  item: multichain.InteropMessage;
  isLoading: boolean;
  animation?: string;
  currencySymbol?: string;
  currentAddress?: string;
}

const CrossChainTxsTableItem = ({ item, isLoading, animation, currencySymbol, currentAddress }: Props) => {

  const sourceChain = React.useMemo(() => {
    const config = multichainConfig();
    return config?.chains.find((chain) => chain.config.chain.id === item.init_chain_id);
  }, [ item ]);

  const targetChain = React.useMemo(() => {
    const config = multichainConfig();
    return config?.chains.find((chain) => chain.config.chain.id === item.relay_chain_id);
  }, [ item ]);

  const value = getCurrencyValue({
    value: item.transfer?.total?.value ?? '0',
    decimals: '18',
  });

  return (
    <TableRow animation={ animation }>
      <TableCell>
        <VStack alignItems="start" gap={ 0 }>
          <Link fontWeight="700" minH="30px" loading={ isLoading } href={ route({ pathname: '/tx/[hash]', query: { hash: String(item.nonce) } }) }>
            { item.nonce }
          </Link>
          <TimeWithTooltip
            timestamp={ item.timestamp }
            isLoading={ isLoading }
            color="text.secondary"
            whiteSpace="nowrap"
            my="5px"
          />
        </VStack>
      </TableCell>
      <TableCell>
        <VStack alignItems="start" gap={ 0 }>
          <TxType types={ [ item.message_type as TransactionType ] } isLoading={ isLoading } my="3px"/>
          <CrossChainTxStatusTag status={ item.status } loading={ isLoading } my="3px"/>
        </VStack>
      </TableCell>
      <TableCell>
        <Badge colorPalette="gray" loading={ isLoading } truncated my="3px">{ item.method }</Badge>
      </TableCell>
      <TableCell>
        { item.init_transaction_hash ? (
          <TxEntity
            hash={ item.init_transaction_hash }
            isLoading={ isLoading }
            truncation="constant"
            chain={ sourceChain }
            minH="30px"
          />
        ) :
          <Spinner size="md" my="5px"/>
        }
      </TableCell>
      <TableCell>
        { item.relay_transaction_hash ? (
          <TxEntity
            hash={ item.relay_transaction_hash }
            isLoading={ isLoading }
            truncation="constant"
            chain={ targetChain }
            minH="30px"
          />
        ) :
          <Spinner size="md" my="5px"/>
        }
      </TableCell>
      <TableCell>
        <AddressFromTo
          from={{ hash: item.sender?.hash ?? 'N/A' }}
          to={{ hash: item.target?.hash ?? 'N/A' }}
          current={ currentAddress }
          isLoading={ isLoading }
          truncation="constant"
          my="5px"
        />
      </TableCell>
      <TableCell isNumeric>
        <Skeleton
          loading={ isLoading }
          display="inline-flex"
          alignItems="center"
          flexWrap="wrap"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          justifyContent="flex-end"
          columnGap={ item.transfer?.token ? 2 : 0 }
          my="5px"
        >
          <span>{ value.valueStr }</span>
          { item.transfer?.token ? (
            <TokenEntity
              token={{
                address_hash: item.transfer.token.address_hash,
                type: 'ERC-20',
                icon_url: '',
                name: '',
                symbol: 'TBD',
                reputation: null,
              }}
              noCopy
              onlySymbol
              justifyContent="flex-end"
              w="fit-content"
            />
          ) : <span> { currencySymbol ?? '' }</span> }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(CrossChainTxsTableItem);
