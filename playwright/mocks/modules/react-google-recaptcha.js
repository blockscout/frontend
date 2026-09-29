// Mock for react-google-recaptcha to keep Playwright component tests off the network
// When Google's script slips past the global request interceptor, it renders with the fake site key and fires onErrored,
// so the reCAPTCHA initialization warning shows up in screenshots at random

import React from 'react';

const ReCAPTCHA = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    execute: () => {},
    executeAsync: () => Promise.resolve('recaptcha_token'),
    reset: () => {},
    getValue: () => null,
    getWidgetId: () => null,
  }), []);

  return null;
});

export default ReCAPTCHA;
