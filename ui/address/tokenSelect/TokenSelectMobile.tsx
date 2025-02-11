import React from 'react';

import type { FormattedData } from './types';

import { DialogContent, DialogRoot } from 'toolkit/chakra/dialog';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

import TokenSelectButton from './TokenSelectButton';
import TokenSelectMenu from './TokenSelectMenu';
import useTokenSelect from './useTokenSelect';

interface Props {
  data: FormattedData;
  isLoading: boolean;
}

const TokenSelectMobile = ({ data, isLoading }: Props) => {
  const { open, onOpenChange } = useDisclosure();
  const result = useTokenSelect(data);

  return (
    <>
      <TokenSelectButton isOpen={ open } data={ result.data } isLoading={ isLoading }/>
      <DialogRoot open={ open } onOpenChange={ onOpenChange } size="full">
        <DialogContent>
          <TokenSelectMenu { ...result }/>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default React.memo(TokenSelectMobile);
