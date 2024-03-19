import { type ThemeConfig } from '@chakra-ui/react';

import appConfig from 'configs/app';

const config: ThemeConfig = {
  initialColorMode: appConfig.UI.theme.initialColorMode,
  useSystemColorMode: false,
  disableTransitionOnChange: false,
};

export default config;
