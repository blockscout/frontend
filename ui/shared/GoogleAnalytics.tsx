import Script from 'next/script';
import React from 'react';

import appConfig from 'configs/app/config';

const GoogleAnalytics = () => {
  if (!appConfig.googleAnalytics.propertyId) {
    return null;
  }

  const id = appConfig.googleAnalytics.propertyId;

  return (
    <>
      <Script src={ `https://www.googletagmanager.com/gtag/js?id=${ id }` }/>
      <Script id="google-analytics">
        { `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ id }');
        ` }
      </Script>
    </>
  );
};

export default React.memo(GoogleAnalytics);
