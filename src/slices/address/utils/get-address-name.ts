// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import { getTagName } from 'src/features/address-metadata/components/tag/utils';

export type AddressNameSource = Partial<Pick<schemas['Address'], 'metadata' | 'ens_domain_name' | 'name'>> & { hash: string };

// The name an address is displayed by, in `AddressEntity`'s order of preference. An address with no name
// of any kind gets `undefined` — the caller decides how to render the bare hash.
export default function getAddressName(address: AddressNameSource): string | undefined {
  const nameTag = (() => {
    const tagData = address.metadata?.tags.find(tag => tag.tagType === 'name');

    if (!tagData || !tagData.name) {
      return;
    }

    return getTagName(tagData, address.hash);
  })();

  return nameTag || address.ens_domain_name || address.name || undefined;
}
