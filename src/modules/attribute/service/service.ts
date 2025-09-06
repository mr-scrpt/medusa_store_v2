// src/modules/attribute/service/service.ts
import { FindConfig } from "@medusajs/framework/types";
import { MedusaContext, MedusaService } from "@medusajs/framework/utils";
import { Context } from "vm";
import { AttributeRelationResponse } from "../domain/api.type"; // Убедитесь, что этот тип импортирован
import AttributeSchema from "../models/attribute";
import AttributeValueSchema from "../models/attribute-value";

class AttributeModuleService extends MedusaService({
  Attribute: AttributeSchema,
  AttributeValue: AttributeValueSchema,
}) {
  // @ts-ignore
  async retrieveAttribute(
    id: string,
    config: FindConfig<any> = {},
    @MedusaContext() sharedContext?: Context | undefined,
    // ✅ ЕДИНСТВЕННОЕ ИЗМЕНЕНИЕ: Мы явно обещаем вернуть этот тип
  ): Promise<AttributeRelationResponse> {
    const attribute = await super.retrieveAttribute(id, config, sharedContext);

    const result = this._transformResponse(
      attribute,
      "attribute",
      config.relations,
    );

    // Мы знаем, что для этого эндпоинта результат будет соответствовать типу,
    // поэтому используем `as`, чтобы сообщить об этом TypeScript.
    return result as AttributeRelationResponse;
  }

  private _transformResponse(
    entity: any,
    entityName: string,
    rawRelations?: FindConfig<any>["relations"],
  ) {
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
        // Проверяем, является ли ключ одной из запрошенных связей
        if (relationKeySet.has(key)) {
          // ✅ ГЛАВНОЕ ИЗМЕНЕНИЕ:
          // Больше не нужны проверки `Array.isArray`.
          // Для любой связи (массив или объект) просто добавляем суффикс `Data`.
          response[`${key}Data`] = entity[key];
        } else {
          // Все остальное по-прежнему идет в основной объект `...Data`
          entityData[key] = entity[key];
        }
      }
    }

    response[`${entityName}Data`] = entityData;
    return response;
  }
}

export default AttributeModuleService;
