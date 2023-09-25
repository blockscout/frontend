import isBrowser from 'lib/isBrowser';
import * as regexp from 'lib/regexp';

export const getEnvValue = (envName: string) => {
  if (isBrowser()) {
    if (window.__envs && window.__envs[envName]) {
      return window.__envs[envName].replaceAll('\'', '"');
    } else {
      return;
    }
  }

  return process.env[envName]?.replaceAll('\'', '"');
};

export const parseEnvJson = <DataType>(env: string | undefined): DataType | null => {
  try {
    return JSON.parse(env || 'null') as DataType | null;
  } catch (error) {
    return null;
  }
};

export const getExternalAssetFilePath = (envName: string) => {
  const parsedValue = getEnvValue(envName);

  if (!parsedValue) {
    return;
  }

  const fileName = envName.replace(/^NEXT_PUBLIC_/, '').replace(/_URL$/, '').toLowerCase();
  const fileExtension = parsedValue.match(regexp.FILE_EXTENSION)?.[1];

  return `/assets/${ fileName }.${ fileExtension }`;
};
