import { useFeatureValue, useGrowthBook } from '@growthbook/growthbook-react';

export default function useGbFeatureValue<T extends Parameters<typeof useFeatureValue>[1]>(
  name: Parameters<typeof useFeatureValue>[0],
  fallback: T,
): { value: ReturnType<typeof useFeatureValue<T>>; isLoading: boolean } {
  const value = useFeatureValue(name, fallback);
  const growthBook = useGrowthBook();

  return { value, isLoading: !(growthBook?.ready ?? true) };
}
