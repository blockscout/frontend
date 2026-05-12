export const SERVICES = {
  mixpanel: {
    name: 'Mixpanel',
  },
  googleAnalytics: {
    name: 'Google Tag Manager',
  },
  rollbar: {
    // TODO @tom2drum fix name if needed
    name: 'Rollbar',
  },
  growthBook: {
    // TODO @tom2drum fix name if needed
    name: 'GrowthBook',
  },
};
// ADBUTLER
// SEVIOADS
// SPECIFY
// TEXT ADS

export const SERVICES_NAMES = Object.values(SERVICES).map(({ name }) => name);
