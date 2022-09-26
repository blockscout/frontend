import {
  Icon,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import infoIcon from 'icons/info.svg';

const TxAdditionalInfoButton = ({ isOpen, onClick }: {isOpen?: boolean; onClick?: () => void}, ref: React.ForwardedRef<HTMLDivElement>) => {

  const infoBgColor = useColorModeValue('blue.50', 'gray.600');
  const infoColor = useColorModeValue('blue.600', 'blue.300');

  return (
    <Center ref={ ref } background={ isOpen ? infoBgColor : 'unset' } borderRadius="8px" w="30px" h="30px" onClick={ onClick }>
      <Icon
        as={ infoIcon }
        boxSize={ 5 }
        color={ infoColor }
        _hover={{ color: 'blue.400' }}
      />
    </Center>
  );
};

export default React.forwardRef(TxAdditionalInfoButton);
