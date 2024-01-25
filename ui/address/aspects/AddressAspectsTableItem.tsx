import { Td, Tr, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AspectType } from 'ui/address/AddressAspects';

type Props = AspectType & {
  page: number;
  isLoading: boolean;
};

const AddressAspectsTableItem = (props: Props) => {
  return (
    <Tr>
      <Td>
        <Skeleton isLoaded={ !props.isLoading } display="inline-block">
          <span>{ props.aspectId }</span>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary" display="inline-block">
          <span>{ props.joinPoints ? Number(props.joinPoints) : '' }</span>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary" display="inline-block">
          <span>{ Number(props.version) }</span>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary" display="inline-block">
          <span>{ Number(props.priority) }</span>
        </Skeleton>
      </Td>

    </Tr>
  );
};

export default React.memo(AddressAspectsTableItem);
