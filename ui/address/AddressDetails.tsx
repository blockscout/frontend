import { Box, Flex, Text, Icon, Button } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address as TAddress } from 'types/api/address';

import metamaskIcon from 'icons/metamask.svg';
import qrCodeIcon from 'icons/qr_code.svg';
import starOutlineIcon from 'icons/star_outline.svg';
import AddressIcon from 'ui/shared/address/AddressIcon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  addressInfo: UseQueryResult<TAddress>;
}

const AddressDetails = ({ addressInfo }: Props) => {
  const { data, isError, isLoading } = addressInfo;
  if (isError || isLoading) {
    return null;
  }

  return (
    <Box>
      <Flex alignItems="center">
        <AddressIcon hash={ data.hash }/>
        <Text ml={ 2 } fontFamily="heading" fontWeight={ 500 }>{ data.hash }</Text>
        <CopyToClipboard text={ data.hash }/>
        <Icon as={ metamaskIcon } boxSize={ 6 } ml={ 2 }/>
        <Button variant="outline" size="sm" ml={ 3 }>
          <Icon as={ starOutlineIcon } boxSize={ 5 }/>
        </Button>
        <Button variant="outline" size="sm" ml={ 2 }>
          <Icon as={ qrCodeIcon } boxSize={ 5 }/>
        </Button>
      </Flex>
    </Box>
  );
};

export default React.memo(AddressDetails);
