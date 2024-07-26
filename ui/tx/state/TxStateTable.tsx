import {
  Table,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { default as Thead } from 'ui/shared/TheadSticky';
import TxStateTableItem from 'ui/tx/state/TxStateTableItem';

interface Props {
  data: Array<TxStateChange>;
  isLoading?: boolean;
  top: number;
}

const TxStateTable = ({ data, isLoading, top }: Props) => {
  const { t } = useTranslation('common');

  return (
    <AddressHighlightProvider>
      <Table variant="simple" minWidth="1000px" size="sm" w="100%">
        <Thead top={ top }>
          <Tr>
            <Th width="140px">{ t('Type') }</Th>
            <Th width="160px">{ t('Address') }</Th>
            <Th width="33%" isNumeric>{ t('Before') }</Th>
            <Th width="33%" isNumeric>{ t('After') }</Th>
            <Th width="33%" isNumeric>{ t('Change') }</Th>
            <Th width="150px" minW="80px" maxW="150px">{ t('tx_area.Token_ID') }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item, index) => <TxStateTableItem data={ item } key={ index } isLoading={ isLoading }/>) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default React.memo(TxStateTable);
