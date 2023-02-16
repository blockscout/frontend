import type { NextPage } from 'next';

const CsvExportPage: NextPage = () => {
  return null;
};

export default CsvExportPage;

export async function getServerSideProps() {
  return {
    notFound: true,
  };
}
