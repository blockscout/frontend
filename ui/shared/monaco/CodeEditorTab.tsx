import { Flex, IconButton, Icon, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import iconCross from 'icons/cross.svg';

import iconFile from './icons/file.svg';
import iconSolidity from './icons/solidity.svg';
import getFilePathParts from './utils/getFilePathParts';
import * as themes from './utils/themes';
import useColors from './utils/useColors';
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
  const colors = useColors();

  const handleClick = React.useCallback(() => {
    onClick(path);
  }, [ onClick, path ]);

  const handleClose = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    !isCloseDisabled && onClose(path);
  }, [ isCloseDisabled, onClose, path ]);

  const color = useColorModeValue('black', 'white');
  const colorInactive = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue(themes.light.colors['editor.background'], themes.dark.colors['editor.background']);
  const bgColorInactive = useColorModeValue('rgb(236, 236, 236)', 'rgb(45, 45, 45)');
  const icon = /.sol|.yul|.vy$/.test(fileName) ? iconSolidity : iconFile;
  const borderColorInactive = useColorModeValue('rgb(243, 243, 243)', 'rgb(37, 37, 38)');

  return (
    <Flex
      pl="10px"
      pr={ isActive ? '4px' : '28px' }
      fontSize="13px"
      lineHeight="34px"
      bgColor={ isActive ? bgColor : bgColorInactive }
      borderRightWidth="1px"
      borderRightColor={ borderColorInactive }
      borderBottomWidth="1px"
      borderBottomColor={ isActive ? 'transparent' : borderColorInactive }
      color={ isActive ? color : colorInactive }
      alignItems="center"
      fontWeight={ 400 }
      cursor="pointer"
      onClick={ handleClick }
      _hover={{
        pr: '4px',
        svg: {
          display: 'block',
        },
      }}
      userSelect="none"
    >
      <Icon as={ icon } boxSize="16px" mr="4px"/>
      <span>{ fileName }</span>
      { folderName && <chakra.span fontSize="xs" color="text_secondary" ml={ 1 }>{ folderName[0] === '.' ? '' : '...' }{ folderName }</chakra.span> }
      <IconButton
        as={ iconCross }
        boxSize={ 5 }
        ml="4px"
        p="2px"
        variant="unstyled"
        aria-label="close"
        onClick={ handleClose }
        isDisabled={ isCloseDisabled }
        display={ isActive ? 'block' : 'none' }
        borderRadius="sm"
        color={ colors.buttons.color }
        _hover={{ bgColor: colors.buttons.bgColorHover }}
      />
    </Flex>
  );
};

export default React.memo(CodeEditorTab);
