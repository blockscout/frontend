import Script from 'next/script';
import React from 'react';

import config from 'configs/app';

const GoogleAnalytics = () => {
  if (!config.features.google_analytics.isEnabled) {
    return null;
  }

  const id = config.features.google_analytics.propertyId;

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
