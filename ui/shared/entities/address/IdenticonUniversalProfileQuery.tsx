import { useQuery } from '@tanstack/react-query';

import React from 'react';
import { Box } from '@chakra-ui/react';
import {getEnvValue} from "../../../../configs/app/utils";

interface Props {
  address: string;
}

type UPResponse = {
  type: string;
  LSP3Profile: {
    name: string;
    profileImage: {
      [key: number]: {
        url: string;
      };
    };
  };
}

export const IdenticonUniversalProfile: React.FC<Props> = ({ address }) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ 'universalProfile', { address: address } ],
    queryFn: async() => {
      const upApiUrl = getEnvValue('NEXT_PUBLIC_UP_API_URL') || '';
      const networkId = getEnvValue('NEXT_PUBLIC_NETWORK_ID') || '42';

      const url = `${ upApiUrl }/v1/${ networkId }/address/${ address }`;
      await fetch(url).then(
        async(res) => {
          return (await res.json() as UPResponse);
        },
      );
    },
  });

  if (isLoading || isError) {
    return '';
  }

  return (
    <Box mr={ 2 } ml={ 1 }>
      <lukso-profile
        size="x-small"
        profile-url={ data.LSP3Profile.profileImage[4].url }
        profile-address={ address }
        has-identicon={ true }
      ></lukso-profile>
    </Box>
  );
};
