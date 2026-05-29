// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue, parseEnvJson } from './utils/envs';

export interface FontFamily {
  name: string;
  url: string;
}

const misc = Object.freeze({
  fonts: {
    heading: parseEnvJson<FontFamily>(getEnvValue('NEXT_PUBLIC_FONT_FAMILY_HEADING')),
    body: parseEnvJson<FontFamily>(getEnvValue('NEXT_PUBLIC_FONT_FAMILY_BODY')),
  },
});

export default misc;
