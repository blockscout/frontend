import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import { CloseButton } from 'toolkit/chakra/close-button';
import Hint from 'ui/shared/Hint';
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

  const fileExtension = getFileExtension(file.name);
  const fileIcon = FILE_ICONS[fileExtension] || 'files/placeholder';

  return (
    <Flex
      maxW="300px"
      overflow="hidden"
      className={ className }
      alignItems="center"
      textAlign="left"
      columnGap={ 2 }
    >
      <IconSvg
        name={ fileIcon }
        boxSize="48px"
        color={ error ? 'text.error' : 'initial' }
      />
      <Box maxW="calc(100% - 58px - 24px)">
        <Flex alignItems="center">
          <Text
            fontWeight={ 600 }
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            color={ error ? 'text.error' : 'initial' }
          >
            { file.name }
          </Text>
          { Boolean(error) && <Hint label={ error } ml={ 1 } color="text.error"/> }
          <CloseButton
            aria-label="Remove"
            ml={ 2 }
            onClick={ handleRemove }
            disabled={ isDisabled }
          />
        </Flex>
        <Text color="text.secondary" textStyle="sm" mt={ 1 }>
          { file.size.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 2, unit: 'byte', unitDisplay: 'narrow', style: 'unit' }) }
        </Text>
      </Box>
    </Flex>
  );
};

export default React.memo(chakra(FileSnippet));
