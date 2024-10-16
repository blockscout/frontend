import { useQuery } from '@tanstack/react-query';

interface TvdaDataPoint {
  date: Date;
  value: number;
}

interface TvdaResponse {
  success: boolean;
  data: Array<TvdaDataPoint>;
}

export const useTvdaChart = () => {
  const { data: tvdaData, error, isLoading } = useQuery({
    queryKey: [ 'get tvda data' ],
    queryFn: async() => {
      const response = await fetch('https://arweaveid-api.vercel.app/api/tvda');

      const data = (await response.json()) as TvdaResponse;
      if (data.success) {
        return data.data;
      }

      return null;
    },
  });

  return { tvdaData, isLoading, error };
};

export default useTvdaChart;
