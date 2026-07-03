// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

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
    tx: schemas['Transaction'];
  }) & {
    isMobile?: boolean;
    isLoading?: boolean;
    className?: string;
  };

type Activation = 'pointer' | 'focus';

const TxAdditionalInfo = ({ hash, tx, isMobile, isLoading, className }: Props) => {
  const [ activation, setActivation ] = React.useState<Activation | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handlePointerEnter = React.useCallback(() => {
    setActivation((prev) => prev ?? 'pointer');
  }, []);

  const handleFocus = React.useCallback(() => {
    setActivation((prev) => prev ?? 'focus');
  }, []);

  // mounting the trigger swaps the button DOM node, so a focus-activated button
  // must be re-focused to not interrupt keyboard navigation
  React.useEffect(() => {
    if (activation === 'focus') {
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [ activation ]);

  // Mounting PopoverRoot (or DialogRoot) creates a zag.js state machine per instance,
  // which is expensive on pages with one popover per table row. Until the first
  // pointer/focus interaction we render only the bare button — the interaction
  // always precedes the click that opens the popover.
  if (activation === null) {
    return (
      <AdditionalInfoButton
        loading={ isLoading }
        className={ className }
        onPointerEnter={ handlePointerEnter }
        onFocus={ handleFocus }
      />
    );
  }

  const content = hash !== undefined ? <TxAdditionalInfoContainer hash={ hash }/> : <TxAdditionalInfoContent tx={ tx }/>;

  if (isMobile) {
    return (
      <DialogRoot size="full">
        <DialogTrigger asChild>
          <AdditionalInfoButton ref={ buttonRef } loading={ isLoading } className={ className }/>
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
        <AdditionalInfoButton ref={ buttonRef } loading={ isLoading } className={ className }/>
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
