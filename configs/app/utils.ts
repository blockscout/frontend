export const getEnvValue = <T extends string>(env: T | undefined): T | undefined => env?.replaceAll('\'', '"') as T;

export const parseEnvJson = <DataType>(env: string | undefined): DataType | null => {
  try {
    return JSON.parse(env || 'null') as DataType | null;
  } catch (error) {
    return null;
  }
};
