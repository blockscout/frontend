// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ThemingConfig } from '@chakra-ui/react';

export const radii: Exclude<ThemingConfig['tokens'], undefined>['radii'] = {
  none: { value: '0' },
  sm: { value: '4px' },
  base: { value: '8px' },
  md: { value: '12px' },
  lg: { value: '16px' },
  xl: { value: '24px' },
  full: { value: '9999px' },
};
