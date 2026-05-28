// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import PageTitle from 'client/shell/page/title/PageTitle';

import { USER_OPS_ITEM } from 'client/features/user-ops/stubs';

import config from 'client/config';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';

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
        title={ config.metadata.seo.enhancedDataEnabled ? `${ config.chain.name } user operations` : 'User operations' }
        withTextAd
      />
      <UserOpsContent query={ query }/>
    </>
  );
};

export default UserOps;
