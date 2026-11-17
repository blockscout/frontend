import breakpoints from 'src/toolkit/theme/foundations/breakpoints';

export type ViewportBreakpoint = 'base' | keyof typeof breakpoints;

export const DEFAULT_VIEWPORT_BREAKPOINT: ViewportBreakpoint = 'lg';

const BASE_VIEWPORT_WIDTH = 320;

const ROOT_FONT_SIZE = 16;

const WIDTH_CONDITION = /\((min|max)-width:\s*(\d+(?:\.\d+)?)(px|rem|em)\)/g;

function getViewportWidth(breakpoint: ViewportBreakpoint): number {
  return breakpoint === 'base' ? BASE_VIEWPORT_WIDTH : Number.parseFloat(breakpoints[breakpoint]);
}

export function mockViewport(breakpoint: ViewportBreakpoint): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: getViewportWidth(breakpoint),
  });
}

export function resetViewport(): void {
  mockViewport(DEFAULT_VIEWPORT_BREAKPOINT);
}

export function matchesViewport(query: string): boolean {
  const conditions = [ ...query.matchAll(WIDTH_CONDITION) ];

  return conditions.length > 0 && conditions.every(([ , bound, value, unit ]) => {
    const width = Number(value) * (unit === 'px' ? 1 : ROOT_FONT_SIZE);

    return bound === 'min' ? window.innerWidth >= width : window.innerWidth <= width;
  });
}
