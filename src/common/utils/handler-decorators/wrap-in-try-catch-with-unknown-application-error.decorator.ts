import { Logger } from '@nestjs/common';
import { err } from 'neverthrow';
import { UnknownApplicationError } from '../../core/domain/base.error';

export const WrapInTryCatchWithUnknownApplicationError = (
  moduleName: string,
): MethodDecorator => {
  const logger = new Logger();

  return (
    target,
    _propertyKey,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const commandOrQueryExecuteMethod = descriptor.value;
    const commandHandlerOrQueryHandlerName = target.constructor.name;

    descriptor.value = function (...args: unknown[]): unknown {
      return commandOrQueryExecuteMethod
        .apply(this, args)
        .catch((error: Error) => {
          logger.error({
            module: moduleName,
            method: commandHandlerOrQueryHandlerName,
            message: `${moduleName} > ${commandHandlerOrQueryHandlerName} > unexpected error: ${error}`,
            stack: error.stack,
          });
          return err(UnknownApplicationError);
        });
    };

    return descriptor;
  };
};
