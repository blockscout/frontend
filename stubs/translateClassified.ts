import type { ClassificationData } from 'types/translateApi';

export const TRANSLATE_CLASSIFIED: ClassificationData = {
  description: 'Sent 0.04 ETH',
  received: [ {
    action: 'Sent Token',
    amount: '45',
    from: { name: '', address: '0xa0393A76b132526a70450273CafeceB45eea6dEE' },
    to: { name: '', address: '0xa0393A76b132526a70450273CafeceB45eea6dEE' },
    token: {
      address: '',
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  } ],
  sent: [],
  source: {
    type: '',
  },
  type: '0x2',
};
