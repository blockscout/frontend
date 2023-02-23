import type { NextPage } from 'next';

const VerifiedContractsPage: NextPage = () => {
  return null;
};

export default VerifiedContractsPage;

export async function getServerSideProps() {
  return {
    notFound: true,
  };
}
