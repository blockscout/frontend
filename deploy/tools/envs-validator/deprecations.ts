// SPDX-License-Identifier: LicenseRef-Blockscout

export interface DeprecatedEnv {
  readonly name: string;
  readonly message: string;
}

export const DEPRECATED_ENVS: ReadonlyArray<DeprecatedEnv> = [
  {
    name: 'NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE',
    message: 'The NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE variable no longer has any effect and will be removed in the next release. ' +
      'The alert is not displayed on the API documentation page anymore.',
  },
];
