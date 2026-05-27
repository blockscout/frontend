// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import { useRouter } from 'next/router';
import React from 'react';

import { fromBech32Address, isBech32Address } from 'client/slices/address/utils/bech32';

export default function useCheckAddressFormat(hash: string) {
  const router = useRouter();
  const hasBech32Format = config.slices.address.hashFormat.availableFormats.includes('bech32') && isBech32Address(hash);
  const [ isLoading, setIsLoading ] = React.useState(hasBech32Format);

  React.useEffect(() => {
    if (!isLoading) {
      return;
    }

    const base16Hash = fromBech32Address(hash);
    if (base16Hash !== hash) {
      router.replace({ pathname: '/address/[hash]', query: { ...router.query, hash: base16Hash } });
    } else {
      setIsLoading(false);
    }
  }, [ hash, isLoading, router ]);

  return isLoading;
}
