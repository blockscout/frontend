import type { SERVICES } from './services';

export type ServiceId = keyof typeof SERVICES;

export type UsercentricsConsentResult = Record<ServiceId, boolean>;
