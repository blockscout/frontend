import appConfig from 'configs/app/config';

// TODO delete when page descriptions is refactored
export default function getNetworkTitle() {
  return appConfig.network.name + (appConfig.network.shortName ? ` (${ appConfig.network.shortName })` : '') + ' Explorer';
}
