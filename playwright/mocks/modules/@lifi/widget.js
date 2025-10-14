export const WidgetEvent = {
  RouteExecutionUpdated: 'RouteExecutionUpdated',
};

export function useWidgetEvents() {
  return {
    on: () => {},
    all: { clear: () => {} },
  };
}

export function LiFiWidget() {
  return null;
}

export default LiFiWidget;
