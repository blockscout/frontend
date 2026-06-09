// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest, NextResponse } from 'next/server';

import type { AddressFormat } from 'src/slices/address/types/config';

import config from 'src/config';
import * as cookiesLib from 'src/shared/storage/cookies';

export default function addressFormatMiddleware(req: NextRequest, res: NextResponse) {
  const addressFormatCookie = req.cookies.get(cookiesLib.NAMES.ADDRESS_FORMAT);
  const defaultFormat = config.slices.address.hashFormat.availableFormats[0];

  if (addressFormatCookie) {
    const isValidCookie = config.slices.address.hashFormat.availableFormats.includes(addressFormatCookie.value as AddressFormat);
    if (!isValidCookie) {
      res.cookies.set(cookiesLib.NAMES.ADDRESS_FORMAT, defaultFormat, cookiesLib.getDefaultAttributes());
    }
  } else {
    res.cookies.set(cookiesLib.NAMES.ADDRESS_FORMAT, defaultFormat, cookiesLib.getDefaultAttributes());
  }
}
