import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import React from 'react';

import iconCopy from 'icons/copy.svg';

interface Props {
  onClick: () => void;
  label: string;
  isDisabled?: boolean;
}

const CoderEditorCollapseButton = ({ onClick, label, isDisabled }: Props) => {
  return (
    <Tooltip label={ label } isDisabled={ isDisabled }>
      <Flex position="absolute" right={ 3 } top={ 2 }>
        <IconButton
          as={ iconCopy }
          boxSize={ 4 }
          variant="unstyled"
          cursor="pointer"
          aria-label="collapse"
          onClick={ onClick }
          isDisabled={ isDisabled }
        />
      </Flex>
    </Tooltip>
  );
};

export default React.memo(CoderEditorCollapseButton);
