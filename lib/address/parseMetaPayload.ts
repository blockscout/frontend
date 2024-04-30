import type { AddressMetadataTag } from 'types/api/addressMetadata';
import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

export default function parseMetaPayload(meta: AddressMetadataTag['meta']): AddressMetadataTagFormatted['meta'] {
  try {
    const parsedMeta = JSON.parse(meta || '');

    if (typeof parsedMeta !== 'object' || parsedMeta === null || Array.isArray(parsedMeta)) {
      throw new Error('Invalid JSON');
    }

    const result: AddressMetadataTagFormatted['meta'] = {};

    if ('textColor' in parsedMeta && typeof parsedMeta.textColor === 'string') {
      result.textColor = parsedMeta.textColor;
    }

    if ('bgColor' in parsedMeta && typeof parsedMeta.bgColor === 'string') {
      result.bgColor = parsedMeta.bgColor;
    }

    if ('actionURL' in parsedMeta && typeof parsedMeta.actionURL === 'string') {
      result.actionURL = parsedMeta.actionURL;
    }

    return result;
  } catch (error) {
    return null;
  }
}
