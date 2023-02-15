import type { NextPage } from 'next';

const AuthPage: NextPage = () => {
  return null;
};

export default AuthPage;

export async function getServerSideProps() {
  return {
    notFound: true,
  };
}
