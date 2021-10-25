import * as Beeline from 'honeycomb-beeline';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/.env' });
const beelineInstance = Beeline({
  writeKey: process.env.HONEYCOMB_API_KEY,
  dataset: 'ddh-dojo',
  serviceName: 'libeo-dojo',
});

export function withSpans<T>() {
  return function (target: new (...params: any[]) => T) {
    const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    for (const [propertyKey, descriptor] of Object.entries(descriptors)) {
      const isMethod =
        descriptor.value instanceof Function && propertyKey !== 'constructor';
      if (!isMethod) continue;
      const descriptorWithSpan = withSpan()(
        target.prototype,
        propertyKey,
        descriptor,
      );
      Object.defineProperty(target.prototype, propertyKey, descriptorWithSpan);
    }
  };
}

export function withSpan() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const name = `${target.constructor.name}.${propertyKey}`;
      return beelineInstance.startAsyncSpan({ name, args }, async (span) => {
        try {
          const result = await originalMethod.apply(this, args);
          beelineInstance.addTraceContext({
            status: 'OK',
            result,
          });
          return result;
        } catch (error) {
          beelineInstance.addTraceContext({
            status: 'KO',
            error,
          });
          throw error;
        } finally {
          beelineInstance.finishSpan(span);
        }
      });
    };

    return descriptor;
  };
}
