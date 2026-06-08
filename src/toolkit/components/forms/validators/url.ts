// SPDX-License-Identifier: LicenseRef-Blockscout

export type UrlScheme = 'http' | 'https' | 'ws' | 'wss';

export interface UrlValidatorParams {
  loose?: boolean;
  schemes?: Array<UrlScheme>;
}

export function urlValidator({ loose, schemes = [ 'https', 'http' ] }: UrlValidatorParams = {}) {
  return function(value: string | undefined) {
    if (!value) {
      return true;
    }

    try {
      const valueToTest = (() => {
        if (!loose) {
          return value;
        }

        const hasScheme = schemes.some(scheme => value.startsWith(`${ scheme }://`));
        if (hasScheme) {
          return value;
        }

        return `${ schemes[0] }://${ value }`;
      })();
      new URL(valueToTest);
      return true;
    } catch (error) {
      return 'Incorrect URL';
    }
  };
}

export const DOMAIN_REGEXP =
  /(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z\d][a-z\d-]{0,61}[a-z\d]/gi;

export function domainValidator(value: string | undefined) {
  if (!value) {
    return true;
  }

  const domain = (() => {
    try {
      const url = new URL(`https://${ value }`);
      return url.hostname;
    } catch (error) {
      return;
    }
  })();

  return domain === value.toLowerCase() || 'Incorrect domain';
}
