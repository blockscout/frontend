import {
  HStack,
  Box,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import transactionIcon from 'icons/transactions.svg';
import getValueWithUnit from 'lib/getValueWithUnit';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import InOutTag from 'ui/shared/InOutTag';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
}

const TAG_WIDTH = 48;
const ARROW_WIDTH = 24;

const TxsListItem = ({ tx, isLoading, showBlockInfo, currentAddress, enableTimeIncrement }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const isOut = Boolean(currentAddress && currentAddress === tx.from.hash);
  const isIn = Boolean(currentAddress && currentAddress === tx.to?.hash);

  const timeAgo = useTimeAgoIncrement(tx.timestamp, enableTimeIncrement);

  return (
    <ListItemMobile display="block" width="100%" isAnimated key={ tx.hash }>
      <Flex justifyContent="space-between" mt={ 4 }>
        <HStack>
          <TxType types={ tx.tx_types } isLoading={ isLoading }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
        </HStack>
        <TxAdditionalInfo tx={ tx } isMobile isLoading={ isLoading }/>
      </Flex>
      <Flex justifyContent="space-between" lineHeight="24px" mt={ 3 } alignItems="center">
        <Flex>
          <Icon
            as={ transactionIcon }
            boxSize="30px"
            color="link"
            isLoading={ isLoading }
          />
          <Address width="100%" ml={ 2 }>
            <AddressLink
              hash={ tx.hash }
              type="transaction"
              fontWeight="700"
              truncation="constant"
              isLoading={ isLoading }
            />
          </Address>
        </Flex>
        { tx.timestamp && (
          <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" fontSize="sm">
            <span>{ timeAgo }</span>
          </Skeleton>
        ) }
      </Flex>
      { tx.method && (
        <Flex mt={ 3 }>
          <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Method </Skeleton>
          <Skeleton
            isLoaded={ !isLoading }
            color="text_secondary"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            <span>{ tx.method }</span>
          </Skeleton>
        </Flex>
      ) }
      { showBlockInfo && tx.block !== null && (
        <Box mt={ 2 }>
          <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Block </Skeleton>
          <Skeleton isLoaded={ !isLoading } display="inline-block">
            <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: tx.block.toString() } }) }>{ tx.block }</LinkInternal>
          </Skeleton>
        </Box>
      ) }
      <Flex alignItems="center" height={ 6 } mt={ 6 }>
        <Address w={ `calc((100% - ${ currentAddress ? TAG_WIDTH + 16 : ARROW_WIDTH + 8 }px)/2)` }>
          <AddressIcon address={ tx.from } isLoading={ isLoading }/>
          <AddressLink
            type="address"
            hash={ tx.from.hash }
            alias={ tx.from.name }
            fontWeight="500"
            ml={ 2 }
            isDisabled={ isOut }
            isLoading={ isLoading }
          />
          { !isOut && <CopyToClipboard text={ tx.from.hash } isLoading={ isLoading }/> }
        </Address>
        { (isIn || isOut) ?
          <InOutTag isIn={ isIn } isOut={ isOut } width="48px" mx={ 2 } isLoading={ isLoading }/> : (
            <Box mx={ 2 }>
              <Icon
                as={ rightArrowIcon }
                boxSize={ 6 }
                color="gray.500"
                isLoading={ isLoading }
              />
            </Box>
          ) }
        { dataTo ? (
          <Address w={ `calc((100% - ${ currentAddress ? TAG_WIDTH + 16 : ARROW_WIDTH + 8 }px)/2)` }>
            <AddressIcon address={ dataTo } isLoading={ isLoading }/>
            <AddressLink
              type="address"
              hash={ dataTo.hash }
              alias={ dataTo.name }
              fontWeight="500"
              ml={ 2 }
              isDisabled={ isIn }
              isLoading={ isLoading }
            />
            { !isIn && <CopyToClipboard text={ dataTo.hash } isLoading={ isLoading }/> }
          </Address>
        ) : '-' }
      </Flex>
      <Box mt={ 2 }>
        <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Value { appConfig.network.currency.symbol } </Skeleton>
        <Skeleton isLoaded={ !isLoading } display="inline-block" variant="text_secondary">{ getValueWithUnit(tx.value).toFormat() }</Skeleton>
      </Box>
      <Box mt={ 2 } mb={ 3 }>
        <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Fee { appConfig.network.currency.symbol } </Skeleton>
        <Skeleton isLoaded={ !isLoading } display="inline-block" variant="text_secondary">{ getValueWithUnit(tx.fee.value).toFormat() }</Skeleton>
      </Box>
    </ListItemMobile>
  );
};

export default React.memo(TxsListItem);
