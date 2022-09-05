import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';

interface Props {
  address: string;
  subtitle?: string;
}

const AddressSnippet = ({ address, subtitle }: Props) => {
  return (
    <HStack spacing={ 4 } key={ address } overflow="hidden" alignItems="start" maxW="100%">
      <AddressIcon address={ address }/>
      <Box overflow="hidden">
        <AddressLinkWithTooltip address={ address }/>
        { subtitle && <Text fontSize="sm" variant="secondary" mt={ 0.5 }>{ subtitle }</Text> }
      </Box>
    </HStack>
  );
};

export default React.memo(AddressSnippet);
