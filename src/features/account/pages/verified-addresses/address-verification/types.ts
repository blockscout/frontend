// SPDX-License-Identifier: LicenseRef-Blockscout

export interface AddressVerificationFormFirstStepFields {
  address: string;
}

export interface AddressVerificationFormSecondStepFields {
  signature: string;
  message: string;
}

export interface RootFields {
  root: string;
}

export interface AddressVerificationResponseError {
  code: number;
  message: string;
}
