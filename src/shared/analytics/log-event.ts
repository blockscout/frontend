// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EventTypes, EventPayload } from './events';
import type { TrackOptions } from './provider';
import { track } from './queue';

type LogEventOptions = Pick<TrackOptions, 'sendImmediately'>;

export default function logEvent<EventType extends EventTypes>(
  type: EventType,
  properties?: EventPayload<EventType>,
  options?: LogEventOptions,
): void {
  track(type, properties, options);
}
