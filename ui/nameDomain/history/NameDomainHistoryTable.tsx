import { Table, Tbody, Tr, Th, Link } from '@chakra-ui/react';
import React from 'react';

import type { EnsDomainEventsResponse } from 'types/api/ens';

import IconSvg from 'ui/shared/IconSvg';
import { default as Thead } from 'ui/shared/TheadSticky';

import NameDomainHistoryTableItem from './NameDomainHistoryTableItem';
import type { Sort } from './utils';
import { sortFn } from './utils';

interface Props {
  data: EnsDomainEventsResponse | undefined;
  isLoading?: boolean;
  sort: Sort | undefined;
  onSortToggle: (event: React.MouseEvent) => void;
}

const NameDomainHistoryTable = ({ data, isLoading, sort, onSortToggle }: Props) => {
  const sortIconTransform = sort?.includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <Table variant="simple" size="sm">
      <Thead top={ 0 }>
        <Tr>
          <Th width="25%">Txn hash</Th>
          <Th width="25%" pl={ 9 }>
            <Link display="flex" alignItems="center" justifyContent="flex-start" position="relative" data-field="timestamp" onClick={ onSortToggle }>
              { sort?.includes('timestamp') && (
                <IconSvg
                  name="arrows/east"
                  boxSize={ 4 }
                  transform={ sortIconTransform }
                  color="link"
                  position="absolute"
                  left={ -5 }
                  top={ 0 }
                />
              ) }
              <span>Age</span>
            </Link>
          </Th>
          <Th width="25%">From</Th>
          <Th width="25%">Method</Th>
        </Tr>
      </Thead>
      <Tbody>
        {
          data?.items
            .slice()
            .sort(sortFn(sort))
            .map((item, index) => <NameDomainHistoryTableItem key={ index } { ...item } isLoading={ isLoading }/>)
        }
      </Tbody>
    </Table>
  );
};

export default React.memo(NameDomainHistoryTable);
