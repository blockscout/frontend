import { Box, Flex, Icon, Text, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import crossIcon from 'icons/cross.svg';
import imageIcon from 'icons/image.svg';
import { shortenNumberWithLetter } from 'lib/formatters';

interface Props {
  file: File;
  className?: string;
  index?: number;
  onRemove?: (index?: number) => void;
}

const FileSnippet = ({ file, className, index, onRemove }: Props) => {

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
      <Icon
        as={ crossIcon }
        boxSize={ 6 }
        color="link"
        _hover={{ color: 'link_hovered' }}
        cursor="pointer"
        ml="auto"
        onClick={ handleRemove }
      />
    </Flex>
  );
};

export default React.memo(chakra(FileSnippet));
