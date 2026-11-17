import type { paths } from '@blockscout/api-types';

export const config: paths['/api/v2/config/csv-export']['get'] = {
  limit: 10_000,
  async_enabled: false,
};
