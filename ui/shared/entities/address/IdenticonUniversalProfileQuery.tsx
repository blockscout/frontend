import { Box, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { UniversalProfileProxyResponse } from '../../../../types/api/universalProfile';

import { getEnvValue } from '../../../../configs/app/utils';
import { isUniversalProfileEnabled } from '../../../../lib/api/isUniversalProfileEnabled';

interface Props {
  address: string;
  fallbackIcon: JSX.Element;
}

export const formattedLuksoName = (hash: string, name: string | null) => {
  return `@${ name } (${ hash })`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUniversalProfile = (address: string): UseQueryResult<UniversalProfileProxyResponse | null> => {
  return useQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    staleTime: 60 * 60 * 1000,
    queryKey: [ 'universalProfile', { address } ],
    queryFn: async() => {
      if (!isUniversalProfileEnabled() || /0x0+$/i.test(address)) {
        return null;
      }
      const upApiUrl =
        getEnvValue('NEXT_PUBLIC_UNIVERSAL_PROFILES_API_URL') || '';
      const networkId = getEnvValue('NEXT_PUBLIC_NETWORK_ID') || '42';

      const url = `${ upApiUrl }/v1/${ networkId }/address/${ address }`;
      try {
        const resp = await fetch(url);
        const json = await resp.json();
        return json as UniversalProfileProxyResponse;
      } catch (err) {
        return null;
      }
    },
  });
};

export const IdenticonUniversalProfile: React.FC<Props> = ({
  address,
  fallbackIcon,
}) => {
  const { data: up, isLoading } = useUniversalProfile(address);

  let profileImageUrl = '';
  if (up?.LSP3Profile?.profileImage !== null && up?.hasProfileImage) {
    const lastImageIndex =
      Object.values(up?.LSP3Profile?.profileImage || {}).length - 1;

    profileImageUrl = up?.hasProfileImage ?
      up?.LSP3Profile?.profileImage[lastImageIndex].url :
      '';
  }

  return (
    <Skeleton isLoaded={ !isLoading }>
      { profileImageUrl ? (
        <Box mx={ 2 }>
          <lukso-profile
            size="x-small"
            profile-url={ profileImageUrl }
            profile-address={ address }
            has-identicon={ true }
          ></lukso-profile>
        </Box>
      ) : fallbackIcon }
    </Skeleton>
  );
};

export default IdenticonUniversalProfile;
