import type { NextRequest, NextResponse } from 'next/server';

import type { AddressFormat } from 'types/views/address';

import UI from 'configs/app/ui';
import * as cookiesLib from 'lib/cookies';

export default function addressFormatMiddleware(req: NextRequest, res: NextResponse) {
  const addressFormatCookie = req.cookies.get(cookiesLib.NAMES.ADDRESS_FORMAT);
  const defaultFormat = UI.views.address.hashFormat.availableFormats[0];

  if (addressFormatCookie) {
    const isValidCookie = UI.views.address.hashFormat.availableFormats.includes(addressFormatCookie.value as AddressFormat);
    if (!isValidCookie) {
      res.cookies.set(cookiesLib.NAMES.ADDRESS_FORMAT, defaultFormat, { path: '/' });
    }
  } else {
    res.cookies.set(cookiesLib.NAMES.ADDRESS_FORMAT, defaultFormat, { path: '/' });
  }
}
