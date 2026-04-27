import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { OnOpenChangeHandler } from 'toolkit/hooks/useDisclosure';

import { DialogBody, DialogContent, DialogHeader, DialogRoot } from '../../../chakra/dialog';
import { Heading } from '../../../chakra/heading';

export interface ChartDialogProps {
  open: boolean;
  onOpenChange: OnOpenChangeHandler;
  title: string;
  description?: string;
  headerRightSlot?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartDialog = ({ open, onOpenChange, title, description, headerRightSlot, children }: ChartDialogProps) => {
  return (
    <DialogRoot
      open={ open }
      onOpenChange={ onOpenChange }
      // FIXME: with size="full" the chart will not be expanded to the full height of the modal
      size="cover"
    >
      <DialogContent>
        <DialogHeader/>
        <DialogBody>
          <Flex mb={ 4 } columnGap={ 2 }>
            <Flex flexDir="column" rowGap={ 2 }>
              <Heading mb={ 1 } level="2">
                { title }
              </Heading>
              { description && (
                <Text color="text.secondary" textStyle="sm">
                  { description }
                </Text>
              ) }
            </Flex>
            { headerRightSlot }
          </Flex>
          { children }
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
