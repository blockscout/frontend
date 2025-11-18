import config from 'configs/app';

const UTM_PARAMS = [ 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content' ];

/**
 * Strips UTM parameters from a URL if app is in private mode
 * @param url - The URL string to process
 * @returns The URL with UTM parameters removed if in private mode, otherwise the original URL
 */
export default function stripUtmParams(url: string): string {
  if (config.app.appProfile !== 'private') {
    return url;
  }

  try {
    const urlObj = new URL(url);
    UTM_PARAMS.forEach((param) => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    return url;
  }
}

/**
 * Conditionally adds UTM parameters to a URL only if not in private mode
 * @param url - The URL string to process
 * @param utmParams - Object with UTM parameters to add
 * @returns The URL with UTM parameters added if not in private mode, otherwise the original URL
 */
export function addUtmParamsIfNotPrivate(
  url: string,
  utmParams: Record<string, string>,
): string {
  if (config.app.appProfile === 'private') {
    return url;
  }

  try {
    const urlObj = new URL(url);
    Object.entries(utmParams).forEach(([ key, value ]) => {
      if (key.startsWith('utm_')) {
        urlObj.searchParams.append(key, value);
      }
    });
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    return url;
  }
}
