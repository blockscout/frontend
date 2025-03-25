import {
  chakra,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Flex,
} from '@chakra-ui/react';
import React from 'react';

import type { InteropMessage } from 'types/api/interop';

import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import Popover from 'ui/shared/chakra/Popover';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

type Props = {
  payload: InteropMessage['payload'];
  isLoading?: boolean;
  className?: string;
};

const InteropMessageAdditionalInfo = ({ payload, isLoading, className }: Props) => {
  return (
    <Popover placement="right-start" openDelay={ 300 } isLazy>
      { ({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <AdditionalInfoButton isOpen={ isOpen } isLoading={ isLoading } className={ className }/>
          </PopoverTrigger>
          <PopoverContent border="1px solid" borderColor="divider">
            <PopoverBody fontWeight={ 400 } fontSize="sm">
              <Flex alignItems="center" justifyContent="space-between" mb={ 3 }>
                <Text color="text_secondary" fontWeight="600">Message payload</Text>
                <CopyToClipboard text={ payload } onClick={ onClose }/>
              </Flex>
              <Text>
                { payload }
              </Text>
            </PopoverBody>
          </PopoverContent>
        </>
      ) }
    </Popover>
  );
};

export default React.memo(chakra(InteropMessageAdditionalInfo));
