// SPDX-License-Identifier: LicenseRef-Blockscout

import { useMemo } from 'react';

import type { AppActionData } from '../utils/get-app-action-data';
import { getAppActionData } from '../utils/get-app-action-data';
import useAddressMetadataInfoQuery from './useAddressMetadataInfoQuery';

export default function useAppActionData(address: string | undefined = '', isEnabled = true): AppActionData | null {
  const memoizedArray = useMemo(() => address ? [ address ] : [], [ address ]);
  const { data } = useAddressMetadataInfoQuery(memoizedArray, isEnabled);
  return getAppActionData(data?.addresses[address?.toLowerCase()]?.tags);
}
