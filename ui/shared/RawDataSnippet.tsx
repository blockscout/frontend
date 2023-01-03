import { Box, Flex, Text, Textarea, chakra } from '@chakra-ui/react';
import React from 'react';

import CopyToClipboard from './CopyToClipboard';

interface Props {
  data: string;
  title?: string;
  className?: string;
  rightSlot?: React.ReactNode;
}

const RawDataSnippet = ({ data, className, title, rightSlot }: Props) => {
  return (
    <Box className={ className }>
      <Flex justifyContent={ title ? 'space-between' : 'flex-end' } alignItems="center" mb={ 3 }>
        { title && <Text fontWeight={ 500 }>{ title }</Text> }
        { rightSlot }
        <CopyToClipboard text={ data }/>
      </Flex>
      <Textarea
        variant="filledInactive"
        p={ 4 }
        minHeight="400px"
        value={ data }
        fontSize="sm"
        borderRadius="md"
        readOnly
      />
    </Box>
  );
};

export default React.memo(chakra(RawDataSnippet));
