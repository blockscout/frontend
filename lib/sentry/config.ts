import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import appConfig from 'configs/app';
import { RESOURCE_LOAD_ERROR_MESSAGE } from 'lib/errors/throwOnResourceLoadError';

const feature = appConfig.features.sentry;

export const config: Sentry.BrowserOptions | undefined = (() => {
  if (!feature.isEnabled) {
    return;
  }

  const tracesSampleRate: number | undefined = (() => {
    switch (feature.environment) {
      case 'development':
        return 1;
      case 'staging':
        return 0.75;
      case 'production':
        return 0.2;
    }
  })();

  return {
    environment: feature.environment,
    dsn: feature.dsn,
    release: feature.release,
    enableTracing: feature.enableTracing,
    tracesSampleRate,
    integrations: feature.enableTracing ? [ new BrowserTracing() ] : undefined,

    // error filtering settings
    // were taken from here - https://docs.sentry.io/platforms/node/guides/azure-functions/configuration/filtering/#decluttering-sentry
    ignoreErrors: [
      // Random plugins/extensions
      'top.GLOBALS',
      // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.epicplay.com',
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      'http://loading.retry.widdit.com/',
      'atomicFindClose',
      // Facebook borked
      'fb_xd_fragment',
      // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
      // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',
      // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
      'conduitPage',
      // Generic error code from errors outside the security sandbox
      'Script error.',

      // Relay and WalletConnect errors
      'The quota has been exceeded',
      'Attempt to connect to relay via',
      'WebSocket connection failed for URL: wss://relay.walletconnect.com',

      // API errors
      RESOURCE_LOAD_ERROR_MESSAGE,
    ],
    denyUrls: [
      // Facebook flakiness
      /graph\.facebook\.com/i,
      // Facebook blocked
      /connect\.facebook\.net\/en_US\/all\.js/i,
      // Woopra flakiness
      /eatdifferent\.com\.woopra-ns\.com/i,
      /static\.woopra\.com\/js\/woopra\.js/i,
      // Chrome and other extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      // Other plugins
      /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
      /webappstoolbarba\.texthelp\.com\//i,
      /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,

      // AD fetch failed errors
      /czilladx\.com/i,
      /coinzilla\.com/i,
      /coinzilla\.io/i,
      /slise\.xyz/i,
    ],
  };
})();

export function configureScope(scope: Sentry.Scope) {
  if (!feature.isEnabled) {
    return;
  }
  scope.setTag('app_instance', feature.instance);
}

export function init() {
  if (!config) {
    return;
  }

  Sentry.init(config);
  Sentry.configureScope(configureScope);
}
