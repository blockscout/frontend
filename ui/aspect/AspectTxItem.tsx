import { Skeleton, Td, Tr, VStack } from '@chakra-ui/react';
import React from 'react';

import type { AspectTxs } from '../../types/api/aspect';
import type { TransactionType } from '../../types/api/transaction';

import { route } from 'nextjs-routes';

import rightArrowIcon from '../../icons/arrows/east.svg';
import Address from '../shared/address/Address';
import AddressIcon from '../shared/address/AddressIcon';
import AddressLink from '../shared/address/AddressLink';
import Icon from '../shared/chakra/Icon';
import CopyToClipboard from '../shared/CopyToClipboard';
import CurrencyValue from '../shared/CurrencyValue';
import LinkInternal from '../shared/LinkInternal';
import TxStatus from '../shared/TxStatus';
import TxAdditionalInfo from '../txs/TxAdditionalInfo';
import TxType from '../txs/TxType';

interface IProps {
  data: AspectTxs;
  isLoading?: boolean;
}

export default function AspectTxItem({ data, isLoading }: IProps) {
  const addressFrom = (
    <Address w="100%">
      <AddressIcon
        address={{
          hash: data.from_address_hash,
          is_contract: false,
          implementation_name: '',
        }}
        isLoading={ isLoading }
      />
      <AddressLink
        type="address"
        hash={ data.from_address_hash }
        fontWeight="500"
        ml={ 2 }
        truncation="constant"
        isLoading={ isLoading }
      />
      <CopyToClipboard text={ data.from_address_hash } isLoading={ isLoading }/>
    </Address>
  );

  const addressTo = (
    <Address w="100%">
      <AddressIcon
        address={{
          hash: data.to_address_hash,
          is_contract: false,
          implementation_name: '',
        }}
        isLoading={ isLoading }
      />
      <AddressLink
        type="address"
        hash={ data.to_address_hash }
        fontWeight="500"
        ml={ 2 }
        truncation="constant"
        isLoading={ isLoading }
      />
      <CopyToClipboard text={ data.to_address_hash } isLoading={ isLoading }/>
    </Address>
  );

  return (
    <Tr>
      <Td pl={ 4 }>
        <TxAdditionalInfo hash={ data.hash } isLoading={ isLoading }/>
      </Td>
      <Td pr={ 4 }>
        <VStack alignItems="start" lineHeight="24px">
          <Address width="100%">
            <AddressLink hash={ data.hash } type="transaction" fontWeight="700" isLoading={ isLoading }/>
          </Address>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start">
          <TxType rawInput="" types={ [ data.type ] as Array<TransactionType> } isLoading={ isLoading }/>
          <TxStatus
            status={ data.status }
            errorText={ data.status === 'error' ? data.result : undefined }
            isLoading={ isLoading }
          />
        </VStack>
      </Td>
      <Td>
        <LinkInternal
          href={ route({
            pathname: '/block/[height_or_hash]',
            query: { height_or_hash: data.block_number.toString() },
          }) }
        >
          <Skeleton isLoaded={ !isLoading }>{ data.block_number }</Skeleton>
        </LinkInternal>
      </Td>
      <Td><Skeleton isLoaded={ !isLoading }>{ addressFrom }</Skeleton></Td>
      <Td px={ 0 }>
        <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
      </Td>
      <Td><Skeleton isLoaded={ !isLoading }>{ addressTo }</Skeleton></Td>
      <Td isNumeric>
        <CurrencyValue value={ data.value } accuracy={ 8 } isLoading={ isLoading }/>
      </Td>
      <Td isNumeric>
        <CurrencyValue value={ data.fee.value } accuracy={ 8 } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
}
