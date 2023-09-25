import * as regexp from 'lib/regexp';

// TODO @tom2drum think about solution for PW tests
export default function getExternalAssetFilePath(envName: string, value: string) {
  const fileName = envName.replace(/^NEXT_PUBLIC_/, '').replace(/_URL$/, '').toLowerCase();
  const fileExtension = value.match(regexp.FILE_EXTENSION)?.[1];

  return `/assets/${ fileName }.${ fileExtension }`;
}
