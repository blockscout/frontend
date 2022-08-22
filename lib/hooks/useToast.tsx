import type { UseToastOptions, ToastProps } from '@chakra-ui/react';
import { createToastFn, useChakra } from '@chakra-ui/react';
import React from 'react';

import Toast from 'ui/shared/Toast';

// there is no toastComponent prop in UseToastOptions type
// but these options will be passed to createRenderToast under the hood
// and it accepts custom toastComponent
const defaultOptions: UseToastOptions & { toastComponent?: React.FC<ToastProps> } = {
  toastComponent: Toast,
  position: 'top-right',
  isClosable: true,
  containerStyle: {
    margin: 8,
  },
};

export default function useToastModified() {
  const { theme } = useChakra();

  return React.useMemo(
    () => createToastFn(theme.direction, defaultOptions),
    [ theme.direction ],
  );
}
