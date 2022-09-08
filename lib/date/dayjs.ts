// eslint-disable-next-line no-restricted-imports
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.locale('en');

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);

dayjs.updateLocale('en', {
  formats: {
    LLLL: 'MMMM-DD-YYYY HH:mm:ss A Z UTC',
  },
});

export default dayjs;
