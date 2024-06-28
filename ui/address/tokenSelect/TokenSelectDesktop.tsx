import { PopoverTrigger, PopoverContent, PopoverBody, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { FormattedData } from './types';

import Popover from 'ui/shared/chakra/Popover';

import TokenSelectButton from './TokenSelectButton';
import TokenSelectMenu from './TokenSelectMenu';
import useTokenSelect from './useTokenSelect';

interface Props {
  data: FormattedData;
  isLoading: boolean;
}

const TokenSelectDesktop = ({ data, isLoading }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const result = useTokenSelect(data);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <TokenSelectButton isOpen={ isOpen } onClick={ onToggle } data={ result.data } isLoading={ isLoading }/>
      </PopoverTrigger>
      <PopoverContent w="355px" maxH="450px" overflowY="scroll">
        <PopoverBody px={ 4 } py={ 6 } boxShadow="2xl" >
          <TokenSelectMenu { ...result }/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(TokenSelectDesktop);
