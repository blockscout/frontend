import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';

import iconCross from 'icons/cross.svg';

import getFileName from './utils/getFileName';

interface Props {
  isActive?: boolean;
  path: string;
  onClick: (path: string) => void;
  onClose: (path: string) => void;
  isCloseDisabled: boolean;
}

const CodeEditorTab = ({ isActive, path, onClick, onClose, isCloseDisabled }: Props) => {
  const name = getFileName(path);

  const handleClick = React.useCallback(() => {
    onClick(path);
  }, [ onClick, path ]);

  const handleClose = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    !isCloseDisabled && onClose(path);
  }, [ isCloseDisabled, onClose, path ]);

  return (
    <Flex
      py={ 1 }
      pl={ 3 }
      pr={ isActive ? 0 : 5 }
      fontSize="sm"
      lineHeight={ 6 }
      borderRightWidth="1px"
      borderRightColor="divider"
      borderBottomWidth="1px"
      borderBottomColor={ isActive ? 'deeppink' : 'divider' }
      color={ isActive ? 'black' : 'gray.600' }
      alignItems="center"
      fontWeight={ 500 }
      mb="-1px"
      cursor="pointer"
      onClick={ handleClick }
      _hover={{
        pr: '0',
        svg: {
          display: 'block',
        },
      }}
    >
      <span>{ name }</span>
      <IconButton
        as={ iconCross }
        boxSize={ 5 }
        p="2px"
        variant="unstyled"
        aria-label="close"
        onClick={ handleClose }
        isDisabled={ isCloseDisabled }
        display={ isActive ? 'block' : 'none' }
      />
    </Flex>
  );
};

export default React.memo(CodeEditorTab);
