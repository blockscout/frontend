import type { UseToastOptions } from '@chakra-ui/react';
import { createToastFn, useChakra } from '@chakra-ui/react';
import React from 'react';

import Toast from 'ui/shared/Toast';

const defaultOptions = {
  toastComponent: Toast,
  position: 'top-right',
  duration: 10000000,
  isClosable: true,
};

export default function useToastModified() {
  const { theme } = useChakra();

  return React.useMemo(
    // there is no toastComponent prop in UseToastOptions type
    // but these options will be passed to createRenderToast under the hood
    // and it accepts custom toastComponent
    // so we safely (I hope) do this type conversion
    () => createToastFn(theme.direction, defaultOptions as UseToastOptions),
    [ theme.direction ],
  );
}
