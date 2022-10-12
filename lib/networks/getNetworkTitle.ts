import appConfig from 'configs/app/config';

export default function getNetworkTitle() {
  return appConfig.network.name + (appConfig.network.shortName ? ` (${ appConfig.network.shortName })` : '') + ' Explorer';
}
