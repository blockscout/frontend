import type { NextPage } from 'next';

const Auth0Page: NextPage = () => {
  return null;
};

export default Auth0Page;

export async function getServerSideProps() {
  return {
    notFound: true,
  };
}
