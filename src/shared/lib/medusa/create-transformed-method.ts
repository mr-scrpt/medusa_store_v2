import { FindConfig } from "@medusajs/framework/types";
import { transformEntityResponse } from "./transform-response";

// Определяем типы для ясности
type SingleEntityPromise<T> = Promise<T | null>;
type ListAndCountPromise<T> = Promise<[T[], number]>;

/**
 * Создает и типизирует новый метод, который оборачивает оригинальный метод Medusa
 * для трансформации его ответа.
 *
 * @param originalMethod - Оригинальный метод (например, super.retrieveAttribute).
 * @param entityName - Имя сущности для трансформации.
 * @returns Новый, полностью типизированный метод.
 */
export function createTransformedMethod<
  TOriginal extends Record<string, any>, // Тип, который возвращает super (e.g., Attribute)
  TTransformed, // Тип, который мы хотим получить (e.g., AttributeRelationResponse)
  TArgs extends any[], // Типы аргументов оригинального метода
>(
  originalMethod: (
    ...args: TArgs
  ) => SingleEntityPromise<TOriginal> | ListAndCountPromise<TOriginal>,
  entityName: string,
): (
  ...args: TArgs
) => SingleEntityPromise<TTransformed> | ListAndCountPromise<TTransformed> {
  // Возвращаем новую асинхронную функцию, которая будет нашим новым методом
  return async function (...args: TArgs): Promise<any> {
    // Вызываем оригинальный метод, который нам передали
    const result = await originalMethod.apply(this, args);
    const config: FindConfig<any> | undefined = args[1]; // Ищем config во втором аргументе

    // Проверяем, это результат listAndCount (массив [entities, count]) или retrieve (один объект)
    if (Array.isArray(result)) {
      const [entities, count] = result;
      const transformedEntities = entities.map((entity: any) =>
        transformEntityResponse(entity, entityName, config?.relations),
      );
      return [transformedEntities, count];
    }

    // Если это один объект
    return transformEntityResponse(result, entityName, config?.relations);
  };
}
