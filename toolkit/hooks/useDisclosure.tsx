// eslint-disable-next-line no-restricted-imports
import { useDisclosure as useDisclosureChakra } from '@chakra-ui/react';
import React from 'react';

export function useDisclosure() {
  const { open, onOpen, onClose, onToggle } = useDisclosureChakra();

  const onOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (open) {
      onOpen();
    } else {
      onClose();
    }
  }, [ onOpen, onClose ]);

  return {
    open,
    onOpenChange,
    onClose,
    onOpen,
    onToggle,
  };
}
