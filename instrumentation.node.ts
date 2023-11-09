/* eslint-disable no-console */
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'blockscout_frontend',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.NEXT_PUBLIC_GIT_TAG || process.env.NEXT_PUBLIC_GIT_COMMIT_SHA || 'unknown_version',
    [SemanticResourceAttributes.SERVICE_INSTANCE_ID]:
        process.env.NEXT_PUBLIC_APP_INSTANCE ||
        process.env.NEXT_PUBLIC_APP_HOST?.replace('.blockscout.com', '').replaceAll('-', '_') ||
        'unknown_app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
  traceExporter:
    process.env.NODE_ENV === 'production' ?
      new OTLPTraceExporter({
        // optional - default url is http://localhost:4318/v1/traces
        url: 'opentelemetry.opentelemetry-opentelemetry-collector.svc.cluster.local:4318/v1/traces',
      }) :
      new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter:
      process.env.NODE_ENV === 'production' ?
        new OTLPMetricExporter({
          // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
          url: 'opentelemetry.opentelemetry-opentelemetry-collector.svc.cluster.local:4318/v1/metrics',
        }) :
        new ConsoleMetricExporter(),
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingPaths: [
          ...(process.env.NODE_ENV !== 'production' ?
            [ /^\/_next\/static.*/ ] :
            []
          ),
        ],
        // This gives your request spans a more meaningful name
        // than `HTTP GET`
        // requestHook: (span, request) => {
        //   span.setAttributes({
        //     name: `${ request.method } ${ request.url || request.path }`,
        //   });
        // },

        // Re-assign the root span's attributes
        // startIncomingSpanHook: (request) => {
        //   return {
        //     name: `${ request.method } ${ request.url || request.path }`,
        //     'request.path': request.url || request.path,
        //   };
        // },
      },
    }),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
