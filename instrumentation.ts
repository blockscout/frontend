export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_OPEN_TELEMETRY_ENABLED === 'true') {
    await import('./instrumentation.node');
  }
}
