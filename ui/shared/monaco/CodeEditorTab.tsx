import { Flex, Icon, chakra, Box } from '@chakra-ui/react';
import React from 'react';

import useThemeColors from 'ui/shared/monaco/utils/useThemeColors';

import iconFile from './icons/file.svg';
import iconSolidity from './icons/solidity.svg';
import getFilePathParts from './utils/getFilePathParts';

interface Props {
  isActive?: boolean;
  path: string;
  onClick: (path: string) => void;
  onClose: (path: string) => void;
  isCloseDisabled: boolean;
  tabsPathChunks: Array<Array<string>>;
}

const CodeEditorTab = ({ isActive, path, onClick, onClose, isCloseDisabled, tabsPathChunks }: Props) => {
  const [ fileName, folderName ] = getFilePathParts(path, tabsPathChunks);
  const themeColors = useThemeColors();

  const handleClick = React.useCallback(() => {
    onClick(path);
  }, [ onClick, path ]);

  const handleClose = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    !isCloseDisabled && onClose(path);
  }, [ isCloseDisabled, onClose, path ]);

  const icon = /.sol|.yul|.vy$/.test(fileName) ? iconSolidity : iconFile;

  return (
    <Flex
      pl="10px"
      pr="4px"
      fontSize="13px"
      lineHeight="34px"
      bgColor={ isActive ? themeColors['tab.activeBackground'] : themeColors['tab.inactiveBackground'] }
      borderRightWidth="1px"
      borderRightColor={ themeColors['tab.border'] }
      borderBottomWidth="1px"
      borderBottomColor={ isActive ? 'transparent' : themeColors['tab.border'] }
      color={ isActive ? themeColors['tab.activeForeground'] : themeColors['tab.inactiveForeground'] }
      alignItems="center"
      fontWeight={ 400 }
      cursor="pointer"
      onClick={ handleClick }
      _hover={{
        '.codicon-close': {
          visibility: 'visible',
        },
      }}
      userSelect="none"
    >
      <Icon as={ icon } boxSize="16px" mr="4px"/>
      <span>{ fileName }</span>
      { folderName && <chakra.span fontSize="11px" opacity={ 0.8 } ml={ 1 }>{ folderName[0] === '.' ? '' : '...' }{ folderName }</chakra.span> }
      <Box
        className="codicon codicon-close"
        boxSize="20px"
        ml="4px"
        p="2px"
        title="Close"
        aria-label="Close"
        onClick={ handleClose }
        borderRadius="sm"
        opacity={ isCloseDisabled ? 0.3 : 1 }
        visibility={{ base: 'visible', lg: isActive ? 'visible' : 'hidden' }}
        color={ themeColors['icon.foreground'] }
        _hover={{ bgColor: isCloseDisabled ? 'transparent' : themeColors['custom.inputOption.hoverBackground'] }}
      />
    </Flex>
  );
};

export default React.memo(CodeEditorTab);
