import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { Link } from 'toolkit/chakra/link';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import IconSvg from 'ui/shared/IconSvg';

import NameDomainHistoryTableItem from './NameDomainHistoryTableItem';
import type { Sort } from './utils';
import { sortFn } from './utils';

interface Props {
  history: bens.ListDomainEventsResponse | undefined;
  domain: bens.DetailedDomain | undefined;
  isLoading?: boolean;
  sort: Sort | undefined;
  onSortToggle: (event: React.MouseEvent) => void;
}

const NameDomainHistoryTable = ({ history, domain, isLoading, sort, onSortToggle }: Props) => {
  const sortIconTransform = sort?.includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <TableRoot>
      <TableHeaderSticky top={ 0 }>
        <TableRow>
          <TableColumnHeader width="25%">Txn hash</TableColumnHeader>
          <TableColumnHeader width="25%" pl={ 9 }>
            <Link display="flex" alignItems="center" justifyContent="flex-start" position="relative" data-field="timestamp" onClick={ onSortToggle }>
              { sort?.includes('timestamp') && (
                <IconSvg
                  name="arrows/east"
                  boxSize={ 4 }
                  transform={ sortIconTransform }
                  color="link.primary"
                  position="absolute"
                  left={ -5 }
                  top={ 0 }
                />
              ) }
              <span>Age</span>
            </Link>
          </TableColumnHeader>
          <TableColumnHeader width="25%">From</TableColumnHeader>
          <TableColumnHeader width="25%">Method</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        {
          history?.items
            .slice()
            .sort(sortFn(sort))
            .map((item, index) => <NameDomainHistoryTableItem key={ index } event={ item } domain={ domain } isLoading={ isLoading }/>)
        }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(NameDomainHistoryTable);
