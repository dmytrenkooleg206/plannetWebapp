export function analyticsEvents(eventType: string) {
  if (typeof window != 'undefined' && Object.hasOwn(window, 'analytics')) {
    (window as any).analytics.track(eventType);
  }

  return true;
}
