// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import PageTitle from 'src/shell/page/title/PageTitle';

import { USER_OPS_ITEM } from 'src/features/user-ops/stubs';

import config from 'src/config';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import UserOpsContent from './UserOpsContent';

const UserOps = () => {
  const query = useQueryWithPages({
    resourceName: 'core:user_ops',
    options: {
      placeholderData: generateListStub<'core:user_ops'>(USER_OPS_ITEM, 50, { next_page_params: {
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
