import type { NextPage } from 'next';

const GraphQLPage: NextPage = () => {
  return null;
};

export default GraphQLPage;

export async function getServerSideProps() {
  return {
    notFound: true,
  };
}
