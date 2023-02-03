import { chakra, useColorMode } from '@chakra-ui/react';
import React from 'react';

import RapiDocReact from './RapiDocReact';

const Rapidoc = () => {
  const colorMode = useColorMode().colorMode;

  if (typeof self !== 'undefined') {
    return (
      <chakra.span>
        <RapiDocReact
          spec-url="/static/spec.json"
          render-style="view"
          theme={ colorMode }
          show-header={ false }
        >
        </RapiDocReact>
      </chakra.span>
    );
  }

  return null;

  // const HTML = `<!doctype html> <!-- Important: must specify -->
  //   <html>
  //   <head>
  //     <meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
  //     <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
  //   </head>
  //   <body>
  //     <rapi-doc
  //       spec-url="/static/spec.json"
  //       theme = ${ cookies.get(cookies.NAMES.COLOR_MODE, cookiesString) }
  //       show-header = false
  //       render-style = "view"
  //     > </rapi-doc>
  //   </body>
  //   </html>`;

  // return <chakra.span dangerouslySetInnerHTML={{ __html: HTML }}/>;
};

export default Rapidoc;
