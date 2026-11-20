// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { MultichainConfig } from 'src/features/multichain/types/client';

import { CLUSTER_CONFIG_SCRIPT_URL, clusterConfig } from './cluster-config';

const loadClusterConfig = (): Promise<MultichainConfig> => {
  return new Promise((resolve, reject) => {
    const script = window.document.createElement('script');

    script.src = CLUSTER_CONFIG_SCRIPT_URL;
    script.onload = () => {
      const value = clusterConfig();
      value ? resolve(value) : reject(new Error('The cluster config script did not define the config'));
    };
    script.onerror = () => {
      script.remove();
      reject(new Error('Unable to load the cluster config script'));
    };

    window.document.head.appendChild(script);
  });
};

// For a view that renders where the document did not load the cluster config: it loads the config script
// once, after which `clusterConfig()` returns the value everywhere. Render nothing that reads
// `clusterConfig()` until the query has succeeded.
export function useClusterConfigQuery(): UseQueryResult<MultichainConfig> {
  return useQuery({
    queryKey: [ 'cluster-config' ],
    queryFn: loadClusterConfig,
    initialData: clusterConfig,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
