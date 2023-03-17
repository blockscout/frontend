import { Tooltip, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  onClick: () => void;
  label: string;
  isDisabled?: boolean;
  isCollapsed?: boolean;
}

const CoderEditorCollapseButton = ({ onClick, label, isDisabled, isCollapsed }: Props) => {
  const hoverBgColor = useColorModeValue('rgba(184, 184, 184, 0.31)', 'rgba(90, 93, 94, 0.31)');
  return (
    <Tooltip label={ label } isDisabled={ isDisabled }>
      <Box
        position="absolute"
        right="12px"
        top="8px"
        zIndex="sticky1"
        className={ isCollapsed ? 'codicon codicon-search-expand-results' : 'codicon codicon-collapse-all' }
        opacity={ isDisabled ? 0.6 : 1 }
        boxSize="20px"
        p="2px"
        borderRadius="sm"
        _before={{
          content: isCollapsed ? '"\\eb95"' : '"\\eac5"',
        }}
        _hover={{
          bgColor: hoverBgColor,
        }}
        onClick={ onClick }
        cursor="pointer"
      />
    </Tooltip>
  );
};

export default React.memo(CoderEditorCollapseButton);
