// SPDX-License-Identifier: LicenseRef-Blockscout

export type AdButlerDeviceConfig = {
  id: string;
  width: string;
  height: string;
};

export type AdButlerConfig = {
  config: {
    desktop: AdButlerDeviceConfig;
    mobile: AdButlerDeviceConfig;
  };
};
