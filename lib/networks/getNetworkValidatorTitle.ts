import appConfig from 'configs/app/config';

export default function getNetworkValidatorTitle() {
  return appConfig.network.verificationType === 'validation' ? 'validator' : 'miner';
}
