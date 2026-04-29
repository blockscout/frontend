import { useFeatureValue, useGrowthBook } from '@growthbook/growthbook-react';

import type { GrowthBookFeatures } from './init';

export default function useGbFeatureValue<Name extends keyof GrowthBookFeatures>(
  name: Name,
  fallback: GrowthBookFeatures[Name],
): { value: ReturnType<typeof useFeatureValue<GrowthBookFeatures[Name]>>; isLoading: boolean } {
  const value = useFeatureValue(name, fallback);
  const growthBook = useGrowthBook();

  return { value, isLoading: !(growthBook?.ready ?? true) };
}
