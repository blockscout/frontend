import { Box, Flex, Text, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import CopyToClipboard from './CopyToClipboard';

interface Props {
  data: React.ReactNode;
  title?: string;
  className?: string;
  rightSlot?: React.ReactNode;
  beforeSlot?: React.ReactNode;
  textareaMaxHeight?: string;
}

const RawDataSnippet = ({ data, className, title, rightSlot, beforeSlot, textareaMaxHeight }: Props) => {
  // see issue in theme/components/Textarea.ts
  const bgColor = useColorModeValue('#f5f5f6', '#1a1b1b');
  return (
    <Box className={ className }>
      <Flex justifyContent={ title ? 'space-between' : 'flex-end' } alignItems="center" mb={ 3 }>
        { title && <Text fontWeight={ 500 }>{ title }</Text> }
        { rightSlot }
        { typeof data === 'string' && <CopyToClipboard text={ data }/> }
      </Flex>
      { beforeSlot }
      <Box
        p={ 4 }
        bgColor={ bgColor }
        maxH={ textareaMaxHeight || '400px' }
        fontSize="sm"
        borderRadius="md"
        wordBreak="break-all"
        whiteSpace="pre-wrap"
        overflowY="auto"
      >
        { data }
      </Box>
    </Box>
  );
};

export default React.memo(chakra(RawDataSnippet));
