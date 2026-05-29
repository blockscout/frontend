// SPDX-License-Identifier: LicenseRef-Blockscout

export default function isBodyAllowed(method: string | undefined | null) {
  return method && ![ 'GET', 'HEAD' ].includes(method);
}
