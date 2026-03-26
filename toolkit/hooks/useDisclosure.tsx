/* eslint-disable no-restricted-imports */
import type { UseDisclosureProps } from '@chakra-ui/react';
import { useDisclosure as useDisclosureChakra } from '@chakra-ui/react';
import React from 'react';

export interface OpenChangeDetails {
  open: boolean;
}

export type OnOpenChangeHandler = (details: OpenChangeDetails) => void;

export function useDisclosure(props?: UseDisclosureProps) {
  const { open, onOpen, onClose, onToggle } = useDisclosureChakra(props);

  const onOpenChange = React.useCallback(({ open }: OpenChangeDetails) => {
    if (open) {
      onOpen();
    } else {
      onClose();
    }
  }, [ onOpen, onClose ]);

  return React.useMemo(() => ({
    open,
    onOpenChange,
    onClose,
    onOpen,
    onToggle,
  }), [ open, onOpenChange, onClose, onOpen, onToggle ]);
}
