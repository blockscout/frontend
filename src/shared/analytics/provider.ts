// SPDX-License-Identifier: LicenseRef-Blockscout

export type AnalyticsProperties = Readonly<Record<string, unknown>>;

export interface ProviderInitOptions {
  readonly debug: boolean;
}

export interface TrackOptions {
  // epoch milliseconds of the original call; present only when a buffered call is replayed
  readonly timestamp?: number;
  // set for events fired right before a full-page navigation, which would cancel a batched send
  readonly sendImmediately?: boolean;
}

export interface AnalyticsProvider {
  init(options: ProviderInitOptions): Promise<void>;
  track(event: string, properties: AnalyticsProperties | undefined, options: TrackOptions): void;
  register(superProps: AnalyticsProperties): void;
  identify(distinctId: string | undefined): void;
  peopleSet(props: AnalyticsProperties): void;
  peopleSetOnce(props: AnalyticsProperties): void;
  reset(): void;
}
