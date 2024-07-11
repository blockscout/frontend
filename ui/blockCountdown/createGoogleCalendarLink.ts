import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
interface Params {
  timeFromNow: number;
  blockHeight: string;
}

const DATE_FORMAT = 'YYYYMMDDTHHmm';

export default function createGoogleCalendarLink({ timeFromNow, blockHeight }: Params): string {

  const date = dayjs().add(timeFromNow, 's');
  const name = `Block #${ blockHeight } reminder | ${ config.chain.name }`;
  const description = `#${ blockHeight } block creation time on ${ config.chain.name } blockchain.`;
  const startTime = date.format(DATE_FORMAT);
  const endTime = date.add(15, 'minutes').format(DATE_FORMAT);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const blockUrl = config.app.baseUrl + route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: blockHeight } });

  const url = new URL('calendar/render', 'https://www.google.com/');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', name);
  url.searchParams.append('details', description + '\n' + blockUrl);
  url.searchParams.append('dates', `${ startTime }/${ endTime }`);
  url.searchParams.append('ctz', timeZone);

  return url.toString();
}
