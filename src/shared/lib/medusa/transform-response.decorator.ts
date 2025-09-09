import { FindConfig } from "@medusajs/framework/types";
import { transformEntityResponse } from "./transform-response";

export function TransformResponse(entityName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const entity = await originalMethod.apply(this, args);

      const config: FindConfig<any> | undefined = args[1];

      return transformEntityResponse(entity, entityName, config?.relations);
    };

    return descriptor;
  };
}

export function TransformListResponse(entityName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [entities, count] = await originalMethod.apply(this, args);

      const config: FindConfig<any> | undefined = args[1];

      const transformedEntities = entities.map((entity: any) =>
        transformEntityResponse(entity, entityName, config?.relations),
      );

      return [transformedEntities, count];
    };

    return descriptor;
  };
}
