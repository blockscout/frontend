import { useColorModeValue, Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import TokenSelectButton from './TokenSelectButton';
import TokenSelectMenu from './TokenSelectMenu';
import useTokenSelect from './useTokenSelect';

interface Props {
  data: Array<AddressTokenBalance>;
}

const TokenSelectDesktop = ({ data }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.900');

  const result = useTokenSelect(data);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <TokenSelectButton isOpen={ isOpen } onClick={ onToggle } data={ result.modifiedData }/>
      </PopoverTrigger>
      <PopoverContent w="355px" maxH="450px" overflowY="scroll">
        <PopoverBody px={ 4 } py={ 6 } bgColor={ bgColor } boxShadow="2xl" >
          <TokenSelectMenu { ...result }/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(TokenSelectDesktop);
