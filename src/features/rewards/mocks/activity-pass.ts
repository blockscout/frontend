import type { CheckActivityPassResponse } from '@blockscout/points-types';

export const valid: CheckActivityPassResponse = {
  is_valid: true,
  activity_pass: {
    offer_id: '1',
    details: undefined,
    valid_since: '2022-11-01T00:00:00.000Z',
    valid_until: '2023-11-01T00:00:00.000Z',
  },
};
