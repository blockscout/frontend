import { Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import type { UPResponse } from '../../../../types/api/universalProfile';

import { getEnvValue } from '../../../../configs/app/utils';

interface Props {
  address: string;
  fallbackIcon: JSX.Element;
}

export const IdenticonUniversalProfile: React.FC<Props> = ({ address, fallbackIcon }) => {
  const [ up, setUp ] = useState({} as UPResponse);
  const queryClient = useQueryClient();
  useEffect(() => {
    (async() => {
      const query = queryClient.getQueryData<UPResponse>([ 'universalProfile', { address: address } ]);
      if (query !== undefined) {
        setUp(query);

        return;
      }
      const data = await queryClient.fetchQuery({
        queryKey: [ 'universalProfile', { address: address } ],
        queryFn: async() => {
          const upApiUrl = getEnvValue('NEXT_PUBLIC_UP_API_URL') || '';
          const networkId = getEnvValue('NEXT_PUBLIC_NETWORK_ID') || '42';

          const url = `${ upApiUrl }/v1/${ networkId }/address/${ address }`;
          try {
            const resp = await fetch(url);
            const json = await resp.json();
            return json as UPResponse;
          } catch (err) {
            return undefined;
          }
        },
      });
      if (data !== undefined) {
        setUp(data);
      }
    })();
  }, [ address, up, setUp, queryClient ]);

  if (up === undefined || up.LSP3Profile === undefined) {
    return fallbackIcon;
  }

  const profileImageUrl = up.LSP3Profile.profileImage === null ? '' : up.LSP3Profile.profileImage[0].url;
  return (
    <Box mr={ 2 } ml={ 1 }>
      <lukso-profile
        size="x-small"
        profile-url={ profileImageUrl }
        profile-address={ address }
        has-identicon={ true }
      ></lukso-profile>
    </Box>
  );
};

export default IdenticonUniversalProfile;
