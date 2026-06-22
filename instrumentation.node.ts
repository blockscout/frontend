// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable no-console */
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const traceExporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
  serviceName: 'blockscout_frontend',
  // service: {
  //   name: 'blockscout_frontend',
  //   version: process.env.NEXT_PUBLIC_GIT_TAG || process.env.NEXT_PUBLIC_GIT_COMMIT_SHA || 'unknown_version',
  //   instance: {
  //     id: process.env.NEXT_PUBLIC_APP_INSTANCE ||
  //       process.env.NEXT_PUBLIC_APP_HOST?.replace('.blockscout.com', '').replaceAll('-', '_') ||
  //       'unknown_app',
  //   },
  // },
  spanProcessors: [ new SimpleSpanProcessor(traceExporter) ],
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter:
      process.env.NODE_ENV === 'production' ?
        new OTLPMetricExporter() :
        new ConsoleMetricExporter(),
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (request) => {
          try {
            if (!request.url) {
              return false;
            }
            const url = new URL(request.url, `http://${ request.headers.host }`);
            if (
              url.pathname.startsWith('/_next/static/') ||
              url.pathname.startsWith('/_next/data/') ||
              url.pathname.startsWith('/assets/') ||
              url.pathname.startsWith('/static/')
            ) {
              return true;
            }
          } catch (error) {}
          return false;
        },
      },
    }),
  ],
});

if (process.env.OTEL_SDK_ENABLED) {
  sdk.start();

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
}
