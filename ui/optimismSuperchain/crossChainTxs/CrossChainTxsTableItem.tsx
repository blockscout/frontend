import { Spinner, VStack } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TransactionType } from 'types/api/transaction';

import multichainConfig from 'configs/multichain';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Badge } from 'toolkit/chakra/badge';
import { Link } from 'toolkit/chakra/link';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import CrossChainTxStatusTag from 'ui/optimismSuperchain/components/CrossChainTxStatusTag';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import AddressFromToIcon from 'ui/shared/address/AddressFromToIcon';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TxType from 'ui/txs/TxType';

interface Props {
  item: multichain.InteropMessage;
  isLoading: boolean;
  animation?: string;
}

const CrossChainTxsTableItem = ({ item, isLoading, animation }: Props) => {

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
      <TableCell pl={ 4 }>
        <AdditionalInfoButton loading={ isLoading }/>
      </TableCell>
      <TableCell>
        <VStack alignItems="start">
          <Link fontWeight="700" loading={ isLoading }>{ item.nonce }</Link>
          <TimeWithTooltip
            timestamp={ item.timestamp }
            isLoading={ isLoading }
            color="text.secondary"
          />
        </VStack>
      </TableCell>
      <TableCell>
        <VStack alignItems="start">
          <TxType types={ [ item.message_type as TransactionType ] } isLoading={ isLoading }/>
          <CrossChainTxStatusTag status={ item.status } loading={ isLoading }/>
        </VStack>
      </TableCell>
      <TableCell>
        <Badge colorPalette="gray" loading={ isLoading } truncated>{ item.method }</Badge>
      </TableCell>
      <TableCell>
        { item.init_transaction_hash ? (
          <TxEntity
            hash={ item.init_transaction_hash }
            isLoading={ isLoading }
            truncation="constant"
            chain={ sourceChain }
          />
        ) :
          <Spinner size="md"/>
        }
      </TableCell>
      <TableCell>
        { item.relay_transaction_hash ? (
          <TxEntity
            hash={ item.relay_transaction_hash }
            isLoading={ isLoading }
            truncation="constant"
            chain={ targetChain }
          />
        ) :
          <Spinner size="md"/>
        }
      </TableCell>
      <TableCell>
        { item.sender ? (
          <AddressEntity
            address={{ hash: item.sender.hash }}
            isLoading={ isLoading }
            chain={ sourceChain }
          />
        ) : '-' }
      </TableCell>
      <TableCell>
        <AddressFromToIcon isLoading={ isLoading } type="unspecified"/>
      </TableCell>
      <TableCell>
        { item.target ? (
          <AddressEntity
            address={{ hash: item.target.hash }}
            isLoading={ isLoading }
            chain={ targetChain }
          />
        ) : '-' }
      </TableCell>
      <TableCell>
        { value.valueStr }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(CrossChainTxsTableItem);
