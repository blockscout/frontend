import { SERVICES, type ServiceId } from './services';
import type { ConsentStatus } from './useUsercentricsConsent';

export default async function getConsentStatus(): Promise<ConsentStatus | undefined> {
  if (!window.__ucCmp) {
    return;
  }
  try {
    const details = await window.__ucCmp.getConsentDetails();

    const serviceIds = details.consent?.serviceIds ?? [];

    const result = serviceIds
      .map((id) => SERVICES[id as ServiceId].name)
      .map((name) => {
        return {
          name,
          given: details.services?.[name]?.consent?.given ?? false,
        };
      })
      .reduce((result, item) => {
        result[item.name as ServiceId] = item.given;
        return result;
      }, {} as ConsentStatus);

    return result;
  } catch {
    return;
  }
}
