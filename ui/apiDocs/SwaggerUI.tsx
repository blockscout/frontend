/* eslint-disable @typescript-eslint/naming-convention */
const SwaggerUIReact = dynamic(() => import('swagger-ui-react'), {
  loading: () => <ContentLoader/>,
  ssr: false,
});

import { Box, useColorModeValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import appConfig from 'configs/app/config';
import ContentLoader from 'ui/shared/ContentLoader';

import 'swagger-ui-react/swagger-ui.css';

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
  const swaggerStyle = {
    '.scheme-container, .opblock-tag': {
      display: 'none',
    },
    '.swagger-ui': {
      color: useColorModeValue('blackAlpha.800', 'whiteAlpha.800'),
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
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reqInterceptor = React.useCallback((req: any) => {
    if (!req.loadSpec) {
      req.url = req.url.replace(DEFAULT_SERVER, appConfig.api.host);
      const url = new URL(req.url);
      url.protocol = 'https:';
      req.url = url.toString();
    }
    return req;
  }, []);

  return (
    <Box sx={ swaggerStyle }>
      <SwaggerUIReact
        url={ appConfig.apiDoc.specUrl }
        plugins={ [ NeverShowInfoPlugin ] }
        requestInterceptor={ reqInterceptor }
      />
    </Box>
  );
};

export default SwaggerUI;
