import appConfig from 'configs/app/config';

// FIXME
// I was not able to figure out how to send CORS with credentials from localhost
// unsuccessfully tried different ways, even custom local dev domain
// so for local development we have to use next.js api as proxy server
export default function isNeedProxy() {
  return appConfig.host === 'localhost' && appConfig.host !== appConfig.api.host;
}
