import { useQuery } from '@tanstack/react-query';

export function useLambdaState() {
  const { data, error, isLoading } = useQuery({
    queryKey: [ 'lambda-state' ],
    queryFn: async() => {
      const response = await fetch('https://ark-lambda-api.vercel.app/api/ark-lambda');
      return response.json();
    },
  });

  return { data, error, isLoading };
}
