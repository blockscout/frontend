// SPDX-License-Identifier: LicenseRef-Blockscout

import { peopleSet, peopleSetOnce } from 'src/services/mixpanel/queue';

interface UserProfileProperties {
  'With Account': boolean;
  'With Connected Wallet': boolean;
  'Device Type': string;
  'First Time Join': string;
}

export function set(props: Partial<UserProfileProperties>) {
  peopleSet(props);
}

export function setOnce(props: Partial<UserProfileProperties>) {
  peopleSetOnce(props);
}
