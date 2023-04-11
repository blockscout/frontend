import { Box, Flex, Icon, Text, useColorModeValue, IconButton, chakra, Tooltip } from '@chakra-ui/react';
import React from 'react';

import CrossIcon from 'icons/cross.svg';
import jsonIcon from 'icons/files/json.svg';
import placeholderIcon from 'icons/files/placeholder.svg';
import solIcon from 'icons/files/sol.svg';
import yulIcon from 'icons/files/yul.svg';
import infoIcon from 'icons/info.svg';

const FILE_ICONS: Record<string, React.FunctionComponent<React.SVGAttributes<SVGElement>>> = {
  '.json': jsonIcon,
  '.sol': solIcon,
  '.yul': yulIcon,
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
  const fileIcon = FILE_ICONS[fileExtension] || placeholderIcon;
  const iconColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Flex
      maxW="300px"
      overflow="hidden"
      className={ className }
      alignItems="center"
      textAlign="left"
    >
      <Icon
        as={ fileIcon }
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
                <Icon as={ infoIcon } boxSize={ 5 } color="error"/>
              </Box>
            </Tooltip>
          ) }
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
