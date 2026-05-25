// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { InteropMessage } from 'client/features/op-interop/types/api';

import AdditionalInfoButton from 'client/shared/buttons/AdditionalInfoButton';
import CopyToClipboard from 'client/shared/text/CopyToClipboard';

import { PopoverBody, PopoverCloseTriggerWrapper, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

type Props = {
  payload: InteropMessage['payload'];
  isLoading?: boolean;
  className?: string;
};

const InteropMessageAdditionalInfo = ({ payload, isLoading, className }: Props) => {
  return (
    <PopoverRoot positioning={{ placement: 'right-start' }}>
      <PopoverTrigger>
        <AdditionalInfoButton loading={ isLoading } className={ className }/>
      </PopoverTrigger>
      <PopoverContent w="330px">
        <PopoverBody>
          <Flex alignItems="center" justifyContent="space-between" mb={ 3 }>
            <Text color="text.secondary" fontWeight="600">Message payload</Text>
            <PopoverCloseTriggerWrapper>
              <CopyToClipboard text={ payload }/>
            </PopoverCloseTriggerWrapper>
          </Flex>
          <Text>
            { payload }
          </Text>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(chakra(InteropMessageAdditionalInfo));
