import { SERVICES_NAMES, type ServiceId } from './services';
import type { ConsentStatus } from './useUsercentricsConsent';

export default async function getConsentStatus(): Promise<ConsentStatus | undefined> {
  if (!window.__ucCmp) {
    return;
  }
  try {
    const details = await window.__ucCmp.getConsentDetails();

    const serviceIds = details.consent?.serviceIds ?? [];

    const result = serviceIds
      .map((id) => {
        return {
          name: details.services?.[id]?.name,
          given: details.services?.[id]?.consent?.given ?? false,
        };
      })
      .filter(({ name }) => name && SERVICES_NAMES.includes(name))
      .reduce((result, item) => {
        result[item.name as ServiceId] = item.given;
        return result;
      }, {} as ConsentStatus);

    return result;
  } catch {
    return;
  }
}
