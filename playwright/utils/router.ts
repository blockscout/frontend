import type { Router } from 'src/toolkit/router/types';

// `hooksConfig.router` crosses from the test to the page in `beforeMount` (playwright/index.ts), which
// never sees the component tree; TestApp reads the overrides back from here when it mounts the provider.

let routerOverrides: Partial<Router> | undefined;

export function setRouterOverrides(overrides: Partial<Router> | undefined): void {
  routerOverrides = overrides;
}

export function getRouterOverrides(): Partial<Router> | undefined {
  return routerOverrides;
}
