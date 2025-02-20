import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { Link } from 'toolkit/chakra/link';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';

import NameDomainsTableItem from './NameDomainsTableItem';
import { type Sort } from './utils';

interface Props {
  data: bens.LookupDomainNameResponse | undefined;
  isLoading?: boolean;
  sort: Sort;
  onSortToggle: (event: React.MouseEvent) => void;
}

const NameDomainsTable = ({ data, isLoading, sort, onSortToggle }: Props) => {
  const sortIconTransform = sort?.toLowerCase().includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <TableRoot>
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="25%">Domain</TableColumnHeader>
          <TableColumnHeader width="25%">Address</TableColumnHeader>
          <TableColumnHeader width="25%" pl={ 9 }>
            <Link display="flex" alignItems="center" justifyContent="flex-start" position="relative" data-field="registration_date" onClick={ onSortToggle }>
              { sort?.includes('registration_date') && (
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
              <span>Registered on</span>
            </Link>
          </TableColumnHeader>
          <TableColumnHeader width="25%">Expiration date</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data?.items.map((item, index) => <NameDomainsTableItem key={ index } { ...item } isLoading={ isLoading }/>) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(NameDomainsTable);
