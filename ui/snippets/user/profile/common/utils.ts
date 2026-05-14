// SPDX-License-Identifier: LicenseRef-Blockscout

export function getUserHandle(email: string) {
  return email.split('@')[0];
}
