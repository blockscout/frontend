import { chakra, DialogBody } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { DialogContent, DialogHeader, DialogRoot, DialogTrigger } from 'toolkit/chakra/dialog';
import { Heading } from 'toolkit/chakra/heading';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';

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

// TODO @tom2drum fix other popovers
const TxAdditionalInfo = ({ hash, tx, isMobile, isLoading, className }: Props) => {
  const content = hash !== undefined ? <TxAdditionalInfoContainer hash={ hash }/> : <TxAdditionalInfoContent tx={ tx }/>;

  if (isMobile) {
    return (
      <DialogRoot size="full">
        <DialogTrigger>
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
        <PopoverBody textStyle="sm">
          <Heading level="3" mb={ 6 }>Additional info </Heading>
          { content }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(chakra(TxAdditionalInfo));
