import { Box, Flex, Text, useColorModeValue, IconButton, chakra, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

const FILE_ICONS: Record<string, IconName> = {
  '.json': 'files/json',
  '.sol': 'files/sol',
  '.yul': 'files/yul',
};

function getFileExtension(fileName: string) {
  const chunks = fileName.split('.');
  if (chunks.length === 1) {
    return '';
  }

  return '.' + chunks[chunks.length - 1];
}

interface Props {
  file: File;
  className?: string;
  index?: number;
  onRemove?: (index?: number) => void;
  isDisabled?: boolean;
  error?: string;
}

const FileSnippet = ({ file, className, index, onRemove, isDisabled, error }: Props) => {
  const handleRemove = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onRemove?.(index);
  }, [ index, onRemove ]);

  const handleErrorHintIconClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();

  }, []);

  const fileExtension = getFileExtension(file.name);
  const fileIcon = FILE_ICONS[fileExtension] || 'files/placeholder';
  const iconColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Flex
      maxW="300px"
      overflow="hidden"
      className={ className }
      alignItems="center"
      textAlign="left"
    >
      <IconSvg
        name={ fileIcon }
        boxSize="74px"
        color={ error ? 'error' : iconColor }
        mr={ 2 }
        borderWidth="2px"
        borderRadius="md"
        borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
        p={ 3 }
      />
      <Box maxW="calc(100% - 58px - 24px)">
        <Flex alignItems="center">
          <Text
            fontWeight={ 600 }
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            color={ error ? 'error' : 'initial' }
          >
            { file.name }
          </Text>
          { Boolean(error) && (
            <Tooltip
              label={ error }
              placement="top"
              maxW="320px"
            >
              <Box cursor="pointer" display="inherit" onClick={ handleErrorHintIconClick } ml={ 1 }>
                <IconSvg name="info" boxSize={ 5 } color="error"/>
              </Box>
            </Tooltip>
          ) }
          <IconButton
            aria-label="remove"
            icon={ <IconSvg name="cross" boxSize={ 6 }/> }
            boxSize={ 6 }
            variant="simple"
            display="inline-block"
            flexShrink={ 0 }
            ml="auto"
            onClick={ handleRemove }
            isDisabled={ isDisabled }
            alignSelf="flex-start"
          />
        </Flex>
        <Text variant="secondary" mt={ 1 }>
          { file.size.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 2, unit: 'byte', unitDisplay: 'narrow', style: 'unit' }) }
        </Text>
      </Box>
    </Flex>
  );
};

export default React.memo(chakra(FileSnippet));
