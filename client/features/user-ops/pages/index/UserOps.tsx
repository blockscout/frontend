// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { USER_OPS_ITEM } from 'client/features/user-ops/stubs';

import config from 'configs/app';
import { generateListStub } from 'stubs/utils';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import UserOpsContent from './UserOpsContent';

const UserOps = () => {
  const query = useQueryWithPages({
    resourceName: 'general:user_ops',
    options: {
      placeholderData: generateListStub<'general:user_ops'>(USER_OPS_ITEM, 50, { next_page_params: {
        page_token: '10355938,0x5956a847d8089e254e02e5111cad6992b99ceb9e5c2dc4343fd53002834c4dc6',
        page_size: 50,
      } }),
    },
  });

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } user operations` : 'User operations' }
        withTextAd
      />
      <UserOpsContent query={ query }/>
    </>
  );
};

export default UserOps;
