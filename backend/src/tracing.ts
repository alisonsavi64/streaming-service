import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const traceExporter = new OTLPTraceExporter({
  url: 'jaeger:14250',
  credentials: require('@grpc/grpc-js').credentials.createInsecure(),
});

export const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

(async () => {
  let connected = false;
  while (!connected) {
    try {
      await sdk.start();
      console.log('Tracing initialized');
      connected = true;
    } catch (err) {
      console.error('Tracing connection failed, retrying in 3s', err);
      await new Promise(res => setTimeout(res, 3000));
    }
  }
})();
