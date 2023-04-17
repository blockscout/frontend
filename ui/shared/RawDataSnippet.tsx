import { Box, Flex, chakra, useColorModeValue, Skeleton } from '@chakra-ui/react';
import React from 'react';

import CopyToClipboard from './CopyToClipboard';

interface Props {
  data: React.ReactNode;
  title?: string;
  className?: string;
  rightSlot?: React.ReactNode;
  beforeSlot?: React.ReactNode;
  textareaMaxHeight?: string;
  showCopy?: boolean;
  isLoading?: boolean;
}

const RawDataSnippet = ({ data, className, title, rightSlot, beforeSlot, textareaMaxHeight, showCopy = true, isLoading }: Props) => {
  // see issue in theme/components/Textarea.ts
  const bgColor = useColorModeValue('#f5f5f6', '#1a1b1b');
  return (
    <Box className={ className } as="section" title={ title }>
      { (title || rightSlot || showCopy) && (
        <Flex justifyContent={ title ? 'space-between' : 'flex-end' } alignItems="center" mb={ 3 }>
          { title && <Skeleton fontWeight={ 500 } isLoaded={ !isLoading }>{ title }</Skeleton> }
          { rightSlot }
          { typeof data === 'string' && showCopy && <CopyToClipboard text={ data } isLoading={ isLoading }/> }
        </Flex>
      ) }
      { beforeSlot }
      <Skeleton
        p={ 4 }
        bgColor={ isLoading ? 'inherit' : bgColor }
        maxH={ textareaMaxHeight || '400px' }
        minH={ isLoading ? '200px' : undefined }
        fontSize="sm"
        borderRadius="md"
        wordBreak="break-all"
        whiteSpace="pre-wrap"
        overflowY="auto"
        isLoaded={ !isLoading }
      >
        { data }
      </Skeleton>
    </Box>
  );
};

export default React.memo(chakra(RawDataSnippet));
