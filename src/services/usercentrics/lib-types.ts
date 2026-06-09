// SPDX-License-Identifier: LicenseRef-Blockscout

// USERCENTRICS LIB TYPES - https://usercentrics.com/docs/web/features/api/interfaces

type ConsentActionType = 'onAcceptAllServices' |
    'onDenyAllServices' |
    'onEssentialChange' |
    'onInitialPageLoad' |
    'onNonEURegion' |
    'onSessionRestored' |
    'onTcfStringChange' |
    'onUpdateServices' |
    'onMobileSessionRestore';

type SettingType = 'TCF' | 'GDPR' | 'CCPA';

type ConsentType = 'IMPLICIT' | 'EXPLICIT';

export interface ConsentDetails {
  consent: ConsentData;
  services: Record<string, ServiceData>;
  categories: Record<string, CategoryData>;
}

interface ConsentData {
  status: 'ALL_ACCEPTED' | 'ALL_DENIED' | 'SOME_ACCEPTED' | 'SOME_DENIED';
  serviceIds?: Array<string>;
  required: boolean;
  version: number;
  controllerId: string;
  language: string;
  createdAt: number;
  updatedAt: number;
  updatedBy: ConsentActionType;
  setting: SettingData;
  type: ConsentType;
  hash: string;
  gpcSignal?: boolean;
  isBot?: true;
  isOutsideEu?: true;
  // not documented fields
  fromUserAction?: boolean;
}

interface SettingData {
  id: string;
  type: SettingType;
  version: string;
  abVariant?: string;
  sandbox?: true;
}

interface ServiceData {
  name: string;
  version: string;
  category: string;
  essential: boolean;
  consent?: {
    given: boolean;
    type: 'IMPLICIT' | 'EXPLICIT';
  };
  gcm?: {
    analyticsStorage?: true;
    adStorage?: true;
  };
  subservices?: Record<string, ServiceData>;
  thirdCountryDataTransfer?: boolean;
  status?: 'added';
}

interface CategoryData {
  dps: Record<string, boolean> | null;
  essential?: boolean;
  hidden?: boolean;
  name: string;
  state: 'ALL_DENIED' | 'SOME_ACCEPTED' | 'ALL_ACCEPTED';
}
