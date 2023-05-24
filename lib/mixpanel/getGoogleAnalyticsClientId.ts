export default function getGoogleAnalyticsClientId() {
  return window.ga?.getAll()[0].get('clientId');
}
