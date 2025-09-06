import { FindConfig } from "@medusajs/framework/types";
import { MedusaContext, MedusaService } from "@medusajs/framework/utils";
import { Context } from "vm";
import { AttributeRelationResponse } from "../domain/api.type";
import AttributeSchema from "../models/attribute";
import AttributeValueSchema from "../models/attribute-value";

class AttributeModuleService extends MedusaService({
  Attribute: AttributeSchema,
  AttributeValue: AttributeValueSchema,
}) {
  //@ts-ignore
  async retrieveAttribute(
    id: string,
    config: FindConfig<any> = {},
    @MedusaContext() sharedContext?: Context | undefined,
  ): Promise<AttributeRelationResponse> {
    const attribute = await super.retrieveAttribute(id, config, sharedContext);

    const result = this._transformResponse(
      attribute,
      "attribute",
      config.relations,
    );

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
        if (relationKeySet.has(key)) {
          response[`${key}Data`] = entity[key];
        } else {
          entityData[key] = entity[key];
        }
      }
    }

    response[`${entityName}Data`] = entityData;
    return response;
  }
}

export default AttributeModuleService;
