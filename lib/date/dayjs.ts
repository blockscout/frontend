// eslint-disable-next-line no-restricted-imports
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekOfYear from 'dayjs/plugin/weekOfYear';

const relativeTimeConfig = {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'ss', r: 59, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 29, d: 'day' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 17 },
    { l: 'yy', d: 'year' },
  ],
};

dayjs.extend(relativeTime, relativeTimeConfig);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(minMax);

dayjs.updateLocale('en', {
  formats: {
    LLLL: 'MMMM-DD-YYYY HH:mm:ss A Z UTC',
  },
  relativeTime: {
    s: 'a sec',
    ss: '%d secs',
    future: 'in %s',
    past: '%s ago',
    m: '1 min',
    mm: '%d mins',
    h: '1 h',
    hh: '%d h',
    d: '1 d',
    dd: '%d d',
    M: '1 mo',
    MM: '%d mo',
    y: '1 y',
    yy: '%d y',
  },
});

dayjs.locale('en');

export default dayjs;
