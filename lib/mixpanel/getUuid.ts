import * as cookies from 'lib/cookies';

export default function getUuid() {
  const cookie = cookies.get(cookies.NAMES.UUID);

  if (cookie) {
    return cookie;
  }

  const uuid = crypto.randomUUID();
  cookies.set(cookies.NAMES.UUID, uuid);

  return uuid;
}
