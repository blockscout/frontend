import { getIronSession } from 'iron-session';
import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import { sessionOptions } from 'lib/session/config';
import Faucet from 'ui/faucet/Faucet';

interface Props {
  verified: boolean;
}

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/faucet">
      <Faucet verified={ props.verified }/>
    </PageNextJs>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async(context) => {
  const { req, res } = context;

  const session = await getIronSession<{ user: any }>(req, res, sessionOptions);
  const user = session.user;

  if (!user) {
    return {
      props: {
        verified: false,
      },
    };
  }

  return {
    props: {
      verified: true,
    },
  };
};

export default Page;
