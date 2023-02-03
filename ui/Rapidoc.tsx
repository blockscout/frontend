import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useAppContext } from 'lib/appContext';
import * as cookies from 'lib/cookies';

const Rapidoc = () => {

  const appProps = useAppContext();
  const cookiesString = appProps.cookies;

  const HTML = `<!doctype html> <!-- Important: must specify -->
    <html>
    <head>
      <meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
      <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
    </head>
    <body>
      <rapi-doc
        spec-url="/static/spec.json"
        theme = ${ cookies.get(cookies.NAMES.COLOR_MODE, cookiesString) }
        show-header = false
        render-style = "view"
      > </rapi-doc>
    </body>
    </html>`;

  return <chakra.span dangerouslySetInnerHTML={{ __html: HTML }}/>;
};

export default Rapidoc;
