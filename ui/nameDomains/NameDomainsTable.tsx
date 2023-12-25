import { Table, Tbody, Tr, Th, Link, Icon } from '@chakra-ui/react';
import React from 'react';

import type { EnsDomainLookupResponse } from 'types/api/ens';

import arrowIcon from 'icons/arrows/east.svg';
import { default as Thead } from 'ui/shared/TheadSticky';

import NameDomainsTableItem from './NameDomainsTableItem';
import { sortFn, type Sort } from './utils';

interface Props {
  data: EnsDomainLookupResponse | undefined;
  isLoading?: boolean;
  sort: Sort | undefined;
  onSortToggle: (event: React.MouseEvent) => void;
}

const NameDomainsTable = ({ data, isLoading, sort, onSortToggle }: Props) => {
  const sortIconTransform = sort?.includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <Table variant="simple" size="sm">
      <Thead top={ 80 }>
        <Tr>
          <Th width="25%">Domain</Th>
          <Th width="25%">Address</Th>
          <Th width="25%" pl={ 9 }>
            <Link display="flex" alignItems="center" justifyContent="flex-start" position="relative" data-field="registration_date" onClick={ onSortToggle }>
              { sort?.includes('registration_date') && (
                <Icon
                  as={ arrowIcon }
                  boxSize={ 4 }
                  transform={ sortIconTransform }
                  color="link"
                  position="absolute"
                  left={ -5 }
                  top={ 0 }
                />
              ) }
              <span>Registered on</span>
            </Link>
          </Th>
          <Th width="25%">Expiration date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {
          data?.items
            .slice()
            .sort(sortFn(sort))
            .map((item, index) => <NameDomainsTableItem key={ index } { ...item } isLoading={ isLoading }/>)
        }
      </Tbody>
    </Table>
  );
};

export default React.memo(NameDomainsTable);