// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import { fromBech32Address, isBech32Address } from 'src/slices/address/utils/bech32';

import config from 'src/config';

export default function useCheckAddressFormat(hash: string) {
  const router = useRouter();
  const hasBech32Format = config.slices.address.hashFormat.availableFormats.includes('bech32') && isBech32Address(hash);
  const base16Hash = hasBech32Format ? fromBech32Address(hash) : hash;
  const needsRedirect = base16Hash !== hash;

  React.useEffect(() => {
    if (needsRedirect) {
      router.replace({ pathname: '/address/[hash]', query: { ...router.query, hash: base16Hash } });
    }
  }, [ base16Hash, needsRedirect, router ]);

  return needsRedirect;
}
