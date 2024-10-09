import type { UseToastOptions, ToastProps } from '@chakra-ui/react';
import { createToastFn, useChakra } from '@chakra-ui/react';
import React from 'react';

import Toast from 'ui/shared/chakra/Toast';

// there is no toastComponent prop in UseToastOptions type
// but these options will be passed to createRenderToast under the hood
// and it accepts custom toastComponent
const defaultOptions: UseToastOptions & { toastComponent?: React.FC<ToastProps> } = {
  toastComponent: Toast,
  position: 'top-right',
  isClosable: true,
  containerStyle: {
    margin: 3,
    marginBottom: 0,
  },
  variant: 'subtle',
};

export default function useToastModified() {
  const { theme } = useChakra();

  return React.useMemo(
    () => createToastFn(theme.direction, defaultOptions),
    [ theme.direction ],
  );
}
