/* eslint-disable quotes */
/* eslint-disable react-hooks/rules-of-hooks */
import type { ChakraProps } from '@chakra-ui/react';
import {
  Box,
  Flex,
  chakra,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
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
  contentProps?: ChakraProps;
}

const RawDataSnippet = ({
  data,
  className,
  title,
  rightSlot,
  beforeSlot,
  textareaMaxHeight,
  showCopy = true,
  isLoading,
  contentProps,
}: Props) => {
  // see issue in theme/components/Textarea.ts
  const bgColor = useColorModeValue('gray.1000', '#1a1b1b');
  return (
    <Box className={ className } as="section" title={ title }>
      { (title || rightSlot || showCopy) && (
        <Flex
          // justifyContent={title ? 'space-between' : 'flex-end'}

          alignItems="center"
          mb={ 4 }
        >
          { title && (
            <Skeleton
              fontWeight={ 500 }
              fontSize="large"
              isLoaded={ !isLoading }
              color={ useColorModeValue("black_secondary", "gray.1000") }
            >
              { title }
            </Skeleton>
          ) }
          { rightSlot }
          { typeof data === 'string' && showCopy && (
            <CopyToClipboard text={ data } isLoading={ isLoading }/>
          ) }
        </Flex>
      ) }
      { beforeSlot }
      <Skeleton
        p={ 5 }
        bgColor={ isLoading ? 'inherit' : bgColor }
        maxH={ textareaMaxHeight || '400px' }
        minH={ isLoading ? '200px' : undefined }
        color={ useColorModeValue("black_secondary", "#D4D4D4") }
        fontSize="14px"
        borderRadius="3xl"
        wordBreak="break-all"
        whiteSpace="pre-wrap"
        overflowX="hidden"
        overflowY="auto"
        fontWeight="medium"
        isLoaded={ !isLoading }
        { ...contentProps }
      >
        { data }
      </Skeleton>
    </Box>
  );
};

export default React.memo(chakra(RawDataSnippet));
