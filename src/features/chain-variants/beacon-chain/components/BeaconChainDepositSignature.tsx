// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

const BeaconChainDepositSignature = ({ signature, isLoading }: { signature: string; isLoading: boolean }) => {
  return (
    <Skeleton loading={ isLoading } display="grid" gridTemplateColumns="1fr 24px" overflow="hidden">
      <Truncate value={ signature } type="end" w="100%"/>
      <CopyToClipboard text={ signature }/>
    </Skeleton>
  );
};

export default React.memo(chakra(BeaconChainDepositSignature));
