import { Logger } from '@nestjs/common';

export const LogPayloadAndResult = (moduleName: string): MethodDecorator => {
  const logger = new Logger();

  return (
    target,
    _propertyKey,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const commandOrQueryExecuteMethod = descriptor.value;
    const commandHandlerOrQueryHandlerName = target.constructor.name;
    const logTemplate = {
      module: moduleName,
      method: commandHandlerOrQueryHandlerName,
    };
    const context: Record<string, any> = {};

    descriptor.value = function (...args: unknown[]): unknown {
      context.payload = args;
      logger.log({
        ...logTemplate,
        message: `${moduleName} > ${commandHandlerOrQueryHandlerName} > called`,
        context,
      });

      return commandOrQueryExecuteMethod
        .apply(this, args)
        .then((commandOrQueryResult: unknown) => {
          context.result = commandOrQueryResult;
          logger.log({
            ...logTemplate,
            message: `${moduleName} > ${commandHandlerOrQueryHandlerName} > executed successfully`,
            context,
          });
          return commandOrQueryResult;
        });
    };

    return descriptor;
  };
};
