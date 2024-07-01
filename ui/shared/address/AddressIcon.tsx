import { Box, chakra, Skeleton, Tooltip } from '@chakra-ui/react';
import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import type { AspectDetail } from '../../../types/api/aspect';
import type { AddressParam } from 'types/api/addressParams';

import AddressContractIcon from 'ui/shared/address/AddressContractIcon';

type Props = {
  address?: Pick<AddressParam, 'hash' | 'is_contract' | 'implementation_name'>;
  aspect?: AspectDetail;
  className?: string;
  isLoading?: boolean;
}

const AddressIcon = ({ address, className, isLoading, aspect }: Props) => {
  if (isLoading) {
    return <Skeleton boxSize={ 6 } className={ className } borderRadius="full" flexShrink={ 0 }/>;
  }

  if (address?.is_contract) {
    return (
      <AddressContractIcon className={ className }/>
    );
  }

  return (
    <Tooltip label={ address?.implementation_name }>
      <Box className={ className } boxSize={ 6 } display="inline-flex">
        <Jazzicon diameter={ 24 } seed={ jsNumberForAddress(address?.hash || aspect?.hash || '') }/>
      </Box>
    </Tooltip>
  );
};

export default chakra(AddressIcon);
