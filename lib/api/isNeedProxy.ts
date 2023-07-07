// import appConfig from 'configs/app/config';

// FIXME
// I was not able to figure out how to send CORS with credentials from localhost
// unsuccessfully tried different ways, even custom local dev domain
// so for local development we have to use next.js api as proxy server
export default function isNeedProxy() {
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NEXT_PUBLIC_APP_INSTANCE === 'pw') {
    return false;
  }
  return true;
}
