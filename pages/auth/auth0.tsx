import type { NextPage } from 'next';

const Page: NextPage = () => {
  return null;
};

export default Page;

export async function getServerSideProps() {
  return {
    notFound: true,
  };
}
