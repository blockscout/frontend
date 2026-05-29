// SPDX-License-Identifier: LicenseRef-Blockscout

import { useUserUpdateRequest } from '@dynamic-labs/sdk-react-core';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'src/features/account/types/api';

import { getResourceKey } from 'src/api/hooks/useApiQuery';

import * as mixpanel from 'src/services/mixpanel';

export default function useLinkEmailDynamic(): () => void {
  const { updateUserWithModal } = useUserUpdateRequest();
  const queryClient = useQueryClient();

  return React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_LINK_INFO, {
      Status: 'Started',
      Type: 'Email',
      Source: 'Profile dropdown',
    });
    updateUserWithModal([ 'email' ]).then((fields) => {
      queryClient.setQueryData(getResourceKey('core:user_info'), (prevData: UserInfo | undefined) => {
        return { ...prevData, email: fields.email };
      });
      mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_LINK_INFO, {
        Status: 'Finished',
        Type: 'Email',
        Source: 'Profile dropdown',
      });
    });
  }, [ queryClient, updateUserWithModal ]);
}
