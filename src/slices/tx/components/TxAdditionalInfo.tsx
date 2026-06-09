// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'src/slices/tx/types/api';

import AdditionalInfoButton from 'src/shared/buttons/AdditionalInfoButton';

import { DialogContent, DialogHeader, DialogRoot, DialogTrigger, DialogBody } from 'src/toolkit/chakra/dialog';
import { Heading } from 'src/toolkit/chakra/heading';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';

import TxAdditionalInfoContainer from './TxAdditionalInfoContainer';
import TxAdditionalInfoContent from './TxAdditionalInfoContent';

type Props =
  ({
    hash: string;
    tx?: undefined;
  } |
  {
    hash?: undefined;
    tx: Transaction;
  }) & {
    isMobile?: boolean;
    isLoading?: boolean;
    className?: string;
  };

const TxAdditionalInfo = ({ hash, tx, isMobile, isLoading, className }: Props) => {
  const content = hash !== undefined ? <TxAdditionalInfoContainer hash={ hash }/> : <TxAdditionalInfoContent tx={ tx }/>;

  if (isMobile) {
    return (
      <DialogRoot size="full">
        <DialogTrigger asChild>
          <AdditionalInfoButton loading={ isLoading } className={ className }/>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            Additional info
          </DialogHeader>
          <DialogBody>
            { content }
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    );
  }
  return (
    <PopoverRoot positioning={{ placement: 'right-start' }}>
      <PopoverTrigger>
        <AdditionalInfoButton loading={ isLoading } className={ className }/>
      </PopoverTrigger>
      <PopoverContent w="330px">
        <PopoverBody>
          <Heading level="3" mb={ 4 }>Additional info </Heading>
          { content }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(chakra(TxAdditionalInfo));
