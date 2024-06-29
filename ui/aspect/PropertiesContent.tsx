import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AspectDetail as TAspectDetail } from '../../types/api/aspect';

import type { ResourceError } from '../../lib/api/resources';
import DataListDisplay from '../shared/DataListDisplay';

interface IProps {
  aspectQuery: UseQueryResult<TAspectDetail, ResourceError>;
}

export default function PropertiesContent({ aspectQuery }: IProps) {

  const properties = Object.keys(aspectQuery.data?.properties || { }).map(key => ({ key, value: aspectQuery.data?.properties[key] }));

  const content = aspectQuery.data ? (
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th width="30%">Key</Th>
          <Th width="30%">Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        { properties.map((property, index) => (
          <Tr key={ index }>
            <Td>{ property.key }</Td>
            <Td>{ property.value }</Td>
          </Tr>
        )) }
      </Tbody>
    </Table>
  ) : null;

  return (
    <DataListDisplay
      isError={ false }
      items={ properties }
      emptyText="There are no properties."
      content={ content }
    />
  );
}
