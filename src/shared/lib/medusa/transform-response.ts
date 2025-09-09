// src/shared/utils/transform-response.ts
import { FindConfig } from "@medusajs/framework/types";

/**
 * Трансформирует сущность, разделяя ее поля и реляции.
 * Реляции переименовываются с добавлением суффикса 'Data'.
 * Основные поля сущности помещаются в объект с ключом `${entityName}Data`.
 *
 * @example
 * // returns { attributeData: { id: 1, name: 'Color' }, valueListData: [...] }
 * transformEntityResponse(attribute, 'attribute', ['valueList'])
 */
export function transformEntityResponse<T extends Record<string, any>>(
  entity: T | null,
  entityName: string,
  rawRelations?: FindConfig<T>["relations"],
): Record<string, any> | null {
  if (!entity) {
    return null;
  }

  const relationKeys: string[] = rawRelations
    ? Array.isArray(rawRelations)
      ? rawRelations
      : Object.keys(rawRelations)
    : [];

  const response: Record<string, any> = {};
  const entityData: Record<string, any> = {};
  const relationKeySet = new Set(relationKeys);

  for (const key in entity) {
    if (Object.prototype.hasOwnProperty.call(entity, key)) {
      if (relationKeySet.has(key)) {
        // Например, valueList -> valueListData
        response[`${key}Data`] = entity[key];
      } else {
        entityData[key] = entity[key];
      }
    }
  }

  // Например, { id, name } -> attributeData: { id, name }
  response[`${entityName}Data`] = entityData;

  return response;
}
