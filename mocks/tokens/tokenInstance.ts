import type { TokenInstance } from 'types/api/token';

import * as addressMock from '../address/address';
import { tokenInfoERC721a } from './tokenInfo';

export const base: TokenInstance = {
  animation_url: null,
  external_app_url: null,
  id: '32925298983216553915666621415831103694597106215670571463977478984525997408266',
  image_url: null,
  is_unique: false,
  holder_address_hash: null,
  metadata: {
    animation_url: null,
    description: 'Sign for you!',
    external_link: null,
    image: 'https://i.seadn.io/gcs/files/1ee1c5e1ead058322615e3206abb8ba3.png?w=500&auto=format',
    name: 'Sign4U',
  },
  owner: addressMock.withName,
  token: tokenInfoERC721a,
};
