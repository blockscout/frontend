import { Tooltip, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import crossIcon from 'icons/cross.svg';

type Props = {
  onClick: () => void;
}

const ResetIconButton = ({ onClick }: Props) => {
  const resetTokenIconColor = useColorModeValue('blue.600', 'blue.300');
  const resetTokenIconHoverColor = useColorModeValue('blue.400', 'blue.200');

  return (
    <Tooltip label="Reset filter">
      <Flex>
        <Icon
          as={ crossIcon }
          boxSize={ 5 }
          ml={ 1 }
          color={ resetTokenIconColor }
          cursor="pointer"
          _hover={{ color: resetTokenIconHoverColor }}
          onClick={ onClick }
        />
      </Flex>
    </Tooltip>
  );
};

export default ResetIconButton;
