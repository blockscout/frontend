import { useUserUpdateRequest } from '@dynamic-labs/sdk-react-core';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import { getResourceKey } from 'lib/api/useApiQuery';
import * as mixpanel from 'lib/mixpanel/index';

const feature = config.features.account;

function useLinkEmailDynamic() {
  const { updateUserWithModal } = useUserUpdateRequest();
  const queryClient = useQueryClient();

  return React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_LINK_INFO, {
      Status: 'Started',
      Type: 'Email',
      Source: 'Profile dropdown',
    });
    updateUserWithModal([ 'email' ]).then((fields) => {
      queryClient.setQueryData(getResourceKey('general:user_info'), (prevData: UserInfo | undefined) => {
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

function useLinkEmailFallback() {
  return React.useCallback(() => {}, []);
}

export default feature.isEnabled && feature.authProvider === 'dynamic' ? useLinkEmailDynamic : useLinkEmailFallback;
