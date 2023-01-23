import { Box, Flex, Icon, Text, useColorModeValue, IconButton, chakra } from '@chakra-ui/react';
import React from 'react';

import CrossIcon from 'icons/cross.svg';
import imageIcon from 'icons/image.svg';
import { shortenNumberWithLetter } from 'lib/formatters';

interface Props {
  file: File;
  className?: string;
  index?: number;
  onRemove?: (index?: number) => void;
  isDisabled?: boolean;
}

const FileSnippet = ({ file, className, index, onRemove, isDisabled }: Props) => {

  const handleRemove = React.useCallback(() => {
    onRemove?.(index);
  }, [ index, onRemove ]);

  return (
    <Flex
      p={ 3 }
      borderWidth="2px"
      borderRadius="md"
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      maxW="300px"
      overflow="hidden"
      className={ className }
    >
      <Icon as={ imageIcon } boxSize="50px" color={ useColorModeValue('gray.600', 'gray.400') } mr={ 2 }/>
      <Box width="calc(100% - 58px - 24px)" >
        <Text fontWeight={ 600 } overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{ file.name }</Text>
        <Text variant="secondary" mt={ 1 }>{ shortenNumberWithLetter(file.size) }B</Text>
      </Box>
      <IconButton
        aria-label="remove"
        icon={ <CrossIcon/> }
        boxSize={ 6 }
        variant="simple"
        display="inline-block"
        flexShrink={ 0 }
        ml="auto"
        onClick={ handleRemove }
        isDisabled={ isDisabled }
      />
    </Flex>
  );
};

export default React.memo(chakra(FileSnippet));
