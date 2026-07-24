// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PickByType } from 'src/shared/types/utils';

import { peopleIncrement, peopleSet, peopleSetOnce } from './queue';

interface UserProfileProperties {
  'With Account': boolean;
  'With Connected Wallet': boolean;
  'Device Type': string;
  'First Time Join': string;
}

type UserProfilePropertiesNumerable = PickByType<UserProfileProperties, number>;

export function set(props: Partial<UserProfileProperties>) {
  peopleSet(props);
}

export function setOnce(props: Partial<UserProfileProperties>) {
  peopleSetOnce(props);
}

export function increment(props: UserProfilePropertiesNumerable) {
  peopleIncrement(props);
}
