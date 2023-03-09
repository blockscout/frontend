/* eslint-disable max-len */
import type { TokenInstance } from 'types/api/token';
import type { ExcludeNull } from 'types/utils/ExcludeNull';

const data = {
  background_color: '000000',
  chain: 'MATIC',
  chain_address: '0x66edbdb80001da74cbf3e6c01ba91154f6e2fb7c',
  name: 'Carmelo Anthony',
  total_nfts: 0,
  animation_url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/dee8734bbefb0d63d6156b6fa0e1385822480589daa1862cbd37a94f6bc2ba3a',
  series_key: 'Series',
  nft_id: 'c746af09-8dcb-4cec-aa8a-5ff02fffc3f1',
  description: 'All-Conference and All-American honors await Carmelo Anthony during his Freshman season for Syracuse. However, Anthony must first defeat a worthy opponent in Georgetown with a double-double effort of 30 points and 15 rebounds.\n \n\n© Syracuse University',
  immutable_uri: 'https://nftu.com/nft-content/metadata/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/7741920',
  contract_address: '0x63cf7b3d5808cb190aa301b55aafd6b4bb95efbb',
  is_pack: false,
  pack_open_locked_until: '2022-03-05T16:58:30.998Z',
  rarity_key: 'Rarity',
  images: {
    png: {
      xs_3: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/xs_3.png',
      },
      xs_2: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/xs_2.png',
      },
      xs_1: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/xs_1.png',
      },
      xl3_3: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/xl3_3.png',
      },
      xl3_2: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/xl3_2.png',
      },
      xl3_1: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/xl3_1.png',
      },
      thumb_3: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/thumb_3.png',
      },
      thumb_2: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/thumb_2.png',
      },
      thumb_1: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/thumb_1.png',
      },
      sm_xl_3: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/sm_xl_3.png',
      },
      sm_xl_2: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/sm_xl_2.png',
      },
      sm_xl_1: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/sm_xl_1.png',
      },
      primary: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3',
        cid: 'Qmf9hHAP884ZwYngk3VdVU7rhKDToykTy24WmcoegapnG8',
      },
      pfp_3: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/pfp_3.png',
      },
      pfp_2: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/pfp_2.png',
      },
      pfp_1: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/pfp_1.png',
      },
      md_2xl_3: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/md_2xl_3.png',
      },
      md_2xl_2: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/md_2xl_2.png',
      },
      md_2xl_1: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/md_2xl_1.png',
      },
      lg_3: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/lg_3.png',
      },
      lg_2: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/lg_2.png',
      },
      lg_1: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/0c66645c4e119f9c5def80273b768138d797f00583f557065a50bb0dd491e8e3/lg_1.png',
      },
    },
    mp4: {
      primary: {
        url: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/dee8734bbefb0d63d6156b6fa0e1385822480589daa1862cbd37a94f6bc2ba3a',
        cid: 'QmPGMksnyQemncHKQ67zGiuTAsnFi8HTJkY9ebQ6eVVQLv',
      },
    },
    'default': 'mp4',
    primary: [
      'QmPGMksnyQemncHKQ67zGiuTAsnFi8HTJkY9ebQ6eVVQLv',
      'https://nftu.com/nft/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/949',
      {
        label: 'foo',
        data: [
          {
            name: 'John',
            email: 'john@foo.com',
          },
          {
            name: 'Mary',
            email: 'mary@foo.com',
          },
          [ 1, 2 ],
        ],
      },
      [
        {
          address: 'foo',
          age: 523,
          gender: 'male',
        },
        {
          address: 'bar',
          age: 24,
          gender: 'https://nftu.com/nft/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/949',
        },
      ],
    ],
  },
  royalty_amount: 1000,
  rarity: 'Premium',
  set_key: 'Set',
  external_url: 'https://nftu.com/nft/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/949',
  attributes: [
    {
      value: 'NCAABB',
      trait_type: 'Sport',
    },
    {
      value: 'Player',
      trait_type: 'Type',
    },
    // {
    //   value: 'Limelight',
    //   trait_type: 'Category',
    // },
    // {
    //   value: 'Portrait',
    //   trait_type: 'Play Type',
    // },
    // {
    //   value: 'Carmelo Anthony',
    //   trait_type: 'Player Name',
    // },
    // {
    //   value: 'F',
    //   trait_type: 'Player Position',
    // },
    {
      value: '15',
      trait_type: 'Player Jersey Number',
      display_type: 'number',
    },
    // {
    //   value: 'Freshman',
    //   trait_type: 'Player Year',
    // },
    // {
    //   value: 'SYR',
    //   trait_type: 'Team Name',
    // },
    // {
    //   value: 'ACC',
    //   trait_type: 'Team Conference',
    // },
    // {
    //   value: '3/1/2003',
    //   trait_type: 'Game Date',
    // },
    // {
    //   value: 'GTWN',
    //   trait_type: 'Opposing Team',
    // },
    // {
    //   value: '93-84',
    //   trait_type: 'Final Score',
    // },
    // {
    //   value: 'Regular Season',
    //   trait_type: 'Game Type',
    // },
    // {
    //   value: '2002-03',
    //   trait_type: 'Season',
    // },
    // {
    //   value: 949,
    //   trait_type: 'Serial',
    // },
  ],
  tags: [ 'foo', 123, true ],
  token_id: '7741920',
  serial_total: 1100,
  blockchain_state: 'BURNING',
  image: 'https://nftu.com/nft-content/media/PAPAYA/92ee5f5c-bce9-4d64-8a25-c7e1e6305572/dee8734bbefb0d63d6156b6fa0e1385822480589daa1862cbd37a94f6bc2ba3a',
  revealed_nfts: null,
  pack_token_id: '7885344',
  nft_data_id: '92ee5f5c-bce9-4d64-8a25-c7e1e6305572',
  serial_key: 'Serial',
  withdrawal_locked_until: '2022-03-05T16:58:30.998Z',
  series: 'Tip-Off',
  immutable_cid: 'QmVigZH1P3D6QWvp2SWVreTPKmDvUYUidNzcUrcYzATpyJ',
  serial: 949,
  status: null,
  circulation_count: 970,
  set: 'Tip-Off',
  transfer_locked_until: '2022-03-05T16:58:30.998Z',
  brand: 'NFTU',
  user_display_name: null,
} as ExcludeNull<TokenInstance['metadata']>;

export default data;
