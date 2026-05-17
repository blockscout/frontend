import config from 'configs/app';

export function getAuthProviderUrl(path?: string) {
  const feature = config.features.account;
  const authUrl = feature.isEnabled ? feature.authUrl : undefined;

  if (!authUrl) {
    return;
  }

  if (!path) {
    return authUrl;
  }

  const separator = authUrl.includes('?') ? '&' : '?';
  return `${ authUrl }${ separator }path=${ encodeURIComponent(path) }`;
}

export function redirectToAuthProvider(path?: string) {
  const url = getAuthProviderUrl(path);

  if (!url || typeof window === 'undefined') {
    return false;
  }

  window.location.assign(url);
  return true;
}
