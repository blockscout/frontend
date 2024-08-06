/* eslint-disable @typescript-eslint/naming-convention */
const SwaggerUIReact = dynamic(() => import('swagger-ui-react'), {
  loading: () => <ContentLoader/>,
  ssr: false,
});

import type { SystemStyleObject } from '@chakra-ui/react';
import { Box, useColorModeValue, useToken } from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import dynamic from 'next/dynamic';
import React from 'react';

import config from 'configs/app';
import colors from 'theme/foundations/colors';
import ContentLoader from 'ui/shared/ContentLoader';

import 'swagger-ui-react/swagger-ui.css';

const feature = config.features.restApiDocs;

const DEFAULT_SERVER = 'blockscout.com/poa/core';

const NeverShowInfoPlugin = () => {
  return {
    components: {
      SchemesContainer: () => null,
      ServersContainer: () => null,
      InfoContainer: () => null,
    },
  };
};

const SwaggerUI = () => {
  const mainColor = useColorModeValue('blackAlpha.800', 'white');
  const borderColor = useToken('colors', colors.grayTrue[700]);
  const mainBgColor = useColorModeValue('blackAlpha.100', colors.grayTrue[700]);

  const swaggerStyle: SystemStyleObject = {
    '.swagger-ui .scheme-container, .opblock-tag': {
      display: 'none',
    },
    '.swagger-ui': {
      color: mainColor,
    },
    '.swagger-ui .opblock-summary-control': {
      bgColor: 'transparent',
    },
    '.swagger-ui .opblock-summary-control:focus': {
      outline: 'none',
    },
    // eslint-disable-next-line max-len
    '.swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-description, .swagger-ui div, .swagger-ui p, .swagger-ui h5, .swagger-ui .response-col_links, .swagger-ui h4, .swagger-ui table thead tr th, .swagger-ui table thead tr td, .swagger-ui .parameter__name, .swagger-ui .parameter__type, .swagger-ui .response-col_status, .swagger-ui .tab li, .swagger-ui .opblock .opblock-section-header h4': {
      color: 'unset',
    },
    '.swagger-ui input': {
      color: 'blackAlpha.800',
    },
    '.swagger-ui .opblock .opblock-section-header': {
      background: useColorModeValue('whiteAlpha.800', 'blackAlpha.800'),
    },
    '.swagger-ui .response-col_description__inner p, .swagger-ui .parameters-col_description p': {
      margin: 0,
    },
    '.swagger-ui .wrapper': {
      padding: 0,
    },
    '.swagger-ui .prop-type': {
      color: useColorModeValue('blue.600', colors.blueLight[400]),
    },
    '.swagger-ui .btn.try-out__btn': {
      borderColor: useToken('colors', colors.grayTrue[200]), //'link'
      color: useToken('colors', colors.grayTrue[200]), //'link'
      borderRadius: 'sm',
    },
    '.swagger-ui .btn.try-out__btn:hover': {
      boxShadow: 'none',
      borderColor: useToken('colors', 'white'),
      color: useToken('colors', 'white'),
    },
    '.swagger-ui .btn.try-out__btn.cancel': {
      borderColor: useToken('colors', colors.error[500]),
      color: useToken('colors', colors.error[500]),
    },
    '.swagger-ui .btn.try-out__btn.cancel:hover': {
      borderColor: useColorModeValue('red.600', colors.error[400]),
      color: useColorModeValue('red.500', colors.error[400]),
    },

    // MODELS
    '.swagger-ui section.models': {
      borderColor: borderColor,
    },
    '.swagger-ui section.models h4': {
      color: mainColor,
    },
    '.swagger-ui section.models .model-container': {
      bgColor: mainBgColor,
    },
    '.swagger-ui .model-title': {
      wordBreak: 'break-all',
      color: mainColor,
    },
    '.swagger-ui .model': {
      color: mainColor,
    },
    '.swagger-ui .model-box-control:focus': {
      outline: 'none',
    },
    '.swagger-ui .model-toggle': {
      bgColor: useColorModeValue('transparent', 'whiteAlpha.700'),
      borderRadius: 'sm',
    },
    '.swagger-ui .model .property.primitive': {
      color: useToken('colors', 'text_secondary'),
      wordBreak: 'break-all',
    },
    'button.opblock-control-arrow > svg': {
      fill: useColorModeValue(colors.grayTrue[300], colors.grayTrue[200]),
    },
    '.opblock.opblock-get': { //use opblock-summary.opblock-summary-get tooo modify only the collapsed design
      bgColor: useColorModeValue('transparent', transparentize(colors.blueLight[500], 0.2)),
      borderColor: useColorModeValue(colors.blueLight[300], colors.blueLight[500]),
      borderRadius: '8px',
    },
    '.opblock-summary.opblock-summary-get': {
      padding: '8px',
      paddingRight: '12px',
    },
    '.opblock.opblock-post, .opblock.opblock-patch': {
      bgColor: useColorModeValue('transparent', transparentize(colors.success[500], 0.2)),
      borderColor: useColorModeValue(colors.success[300], colors.success[500]),
      borderRadius: '8px',
    },
    '.opblock-summary.opblock-summary-post, .opblock-summary.opblock-summary-patch': {
      padding: '8px',
      paddingRight: '12px',
    },
    //Method names
    '.opblock.opblock-get .opblock-summary-method': {
      background: useColorModeValue('transparent', colors.blueLight[500]),
      borderRadius: '8px',
    },
    '.opblock.opblock-post .opblock-summary-method, .opblock.opblock-patch .opblock-summary-method': {
      background: useColorModeValue('transparent', colors.success[500]),
      borderRadius: '8px',
    },
    '.swagger-ui .parameter__name.required:after': {
      color: useColorModeValue('transparent', colors.error[500]),
    },
    '.swagger-ui .copy-to-clipboard': {
      background: useColorModeValue('transparent', colors.grayTrue[500]),
      _active: { background: useColorModeValue('transparent', colors.grayTrue[600]) },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reqInterceptor = React.useCallback((req: any) => {
    if (!req.loadSpec) {
      const newUrl = new URL(req.url.replace(DEFAULT_SERVER, config.api.host));

      newUrl.protocol = config.api.protocol + ':';

      if (config.api.port) {
        newUrl.port = config.api.port;
      }

      req.url = newUrl.toString();
    }
    return req;
  }, []);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Box sx={ swaggerStyle }>
      <SwaggerUIReact
        url={ feature.specUrl }
        plugins={ [ NeverShowInfoPlugin ] }
        requestInterceptor={ reqInterceptor }
      />
    </Box>
  );
};

export default SwaggerUI;
