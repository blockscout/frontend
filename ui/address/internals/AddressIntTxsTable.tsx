import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { currencyUnits } from 'lib/units';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressIntTxsTableItem from './AddressIntTxsTableItem';

interface Props {
  data: Array<InternalTransaction>;
  currentAddress: string;
  isLoading?: boolean;
}

const AddressIntTxsTable = ({ data, currentAddress, isLoading }: Props) => {
  const { t } = useTranslation('common');

  return (
    <AddressHighlightProvider>
      <Table variant="simple" size="sm">
        <Thead top={ 80 }>
          <Tr>
            <Th width="15%">{ t('Parent_txn_hash') }</Th>
            <Th width="15%">{ t('Type') }</Th>
            <Th width="10%">{ t('Block') }</Th>
            <Th width="40%">{ t('From_To') }</Th>
            <Th width="20%" isNumeric>
              { t('Value') } { currencyUnits.ether }
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item, index) => (
            <AddressIntTxsTableItem
              key={ item.transaction_hash + '_' + index }
              { ...item }
              currentAddress={ currentAddress }
              isLoading={ isLoading }
            />
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>

  );
};

export default AddressIntTxsTable;
