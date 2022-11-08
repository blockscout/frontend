import {
  Icon,
  Center,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react';
import React from 'react';

import infoIcon from 'icons/info.svg';

interface Props {
  isOpen?: boolean;
  className?: string;
  onClick?: () => void;
}

const AdditionalInfoButton = ({ isOpen, onClick, className }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {

  const infoBgColor = useColorModeValue('blue.50', 'gray.600');
  const infoColor = useColorModeValue('blue.600', 'blue.300');

  return (
    <Center
      className={ className }
      ref={ ref }
      background={ isOpen ? infoBgColor : 'unset' }
      borderRadius="8px"
      w="24px"
      h="24px"
      onClick={ onClick }
      cursor="pointer"
    >
      <Icon
        as={ infoIcon }
        boxSize={ 5 }
        color={ infoColor }
        _hover={{ color: 'blue.400' }}
      />
    </Center>
  );
};

export default chakra(React.forwardRef(AdditionalInfoButton));
