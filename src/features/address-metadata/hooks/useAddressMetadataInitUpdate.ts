// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiFetch from 'src/api/hooks/useApiFetch';

import config from 'src/config';

const feature = config.features.addressMetadata;

interface Params {
  address: string | undefined;
  isEnabled: boolean;
}

export default function useAddressMetadataInitUpdate({ address, isEnabled }: Params) {

  const apiFetch = useApiFetch();

  React.useEffect(() => {
    if (
      feature.isEnabled &&
        feature.isTagsUpdateEnabled &&
        address &&
        isEnabled
    ) {
      apiFetch('metadata:address_submit', {
        fetchParams: {
          method: 'POST',
          body: {
            addresses: [ address ],
          },
        },
      });
    }
  }, [ address, apiFetch, isEnabled ]);
}
