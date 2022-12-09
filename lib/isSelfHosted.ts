import appConfig from 'configs/app/config';

export default function isSelfHosted() {
  return appConfig.host?.endsWith(appConfig.ad.domainWithAd) || appConfig.host === 'localhost';
}
