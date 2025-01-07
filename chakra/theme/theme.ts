import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// TODO @tom2drum migrate this to the new recipe system
// import components from './components/index';
// import config from './config';
import * as borders from './foundations/borders';
import breakpoints from './foundations/breakpoints';
import colors from './foundations/colors';
import durations from './foundations/durations';
import semanticTokens from './foundations/semanticTokens';
import shadows from './foundations/shadows';
import { fonts, textStyles } from './foundations/typography';
import zIndex from './foundations/zIndex';
import globalCss from './globalCss';
import * as recipes from './recipes';

const customConfig = defineConfig({
  globalCss,
  theme: {
    breakpoints,
    recipes,
    semanticTokens,
    textStyles,
    tokens: {
      ...borders,
      colors,
      durations,
      fonts,
      shadows,
      zIndex,
    },
  },
  // components,
  // config,
});

export default createSystem(defaultConfig, customConfig);
