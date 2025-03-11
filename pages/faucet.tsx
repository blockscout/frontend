// import { getIronSession } from 'iron-session';
import type { NextPage, GetServerSideProps } from 'next';
import React, { useState } from 'react';

import PageNextJs from 'nextjs/PageNextJs';

// import { sessionOptions } from 'lib/session/config';
import Faucet from 'ui/faucet/Faucet';
import PageTitle from 'ui/shared/Page/PageTitle';

interface Props {
  initialVerified: boolean;
}

const Page: NextPage<Props> = ({ initialVerified }: Props) => {
  const [ verified, setVerified ] = useState(initialVerified);

  const handleVerificationChange = React.useCallback((status: boolean) => {
    setVerified(status);
  }, []);

  return (
    <PageNextJs pathname="/faucet">
      <PageTitle title="Faucet" withTextAd/>
      <Faucet verified={ verified } onVerificationChange={ handleVerificationChange }/>
    </PageNextJs>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async() => {
  // const { req, res } = context;

  // const session = await getIronSession<{ user: any }>(req, res, sessionOptions);
  // const user = session.user;

  return {
    props: {
      initialVerified: false,
    },
  };
};

export default Page;
