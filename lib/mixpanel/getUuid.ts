import * as cookies from 'lib/cookies';
import * as growthBook from 'lib/growthbook/consts';
import isBrowser from 'lib/isBrowser';

export default function getUuid() {
  const cookie = cookies.get(cookies.NAMES.UUID);

  if (cookie) {
    return cookie;
  }

  const uuid = crypto.randomUUID();
  cookies.set(cookies.NAMES.UUID, uuid);

  if (isBrowser()) {
    window.localStorage.removeItem(growthBook.STORAGE_KEY);
  }

  return uuid;
}
