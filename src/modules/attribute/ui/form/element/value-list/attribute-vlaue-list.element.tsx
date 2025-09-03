import { AttributeRelationCreateForm } from "@/modules/attribute/domain/from-create.schema";
import cx from "classnames";
import type { ComponentProps } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { AttributeValueRowElement } from "./attribute-value-row.element";
import { Button } from "@medusajs/ui";

type ValueListFieldArray = UseFieldArrayReturn<
  AttributeRelationCreateForm,
  "valueListData"
>;

type AttributeValueListElementProps = ComponentProps<"div"> & {
  fields: ValueListFieldArray["fields"];
  onAppend: ValueListFieldArray["append"];
  onRemove: ValueListFieldArray["remove"];
  children?: React.ReactNode;
};

export const AttributeValueListElement = (
  props: AttributeValueListElementProps,
) => {
  const { fields, onAppend, onRemove, children, className, ...rest } = props;

  return (
    <div className={cx("flex flex-col gap-4", className)} {...rest}>
      {children || (
        <>
          {fields.map((field, index) => (
            <AttributeValueRowElement
              key={field.id}
              index={index}
              onRemove={() => onRemove(index)}
            />
          ))}
          <Button
            type="button"
            onClick={() =>
              onAppend({ name: "", value: "", rank: 0, metadata: "" })
            }
            variant="secondary"
          >
            Add Value
          </Button>
        </>
      )}
    </div>
  );
};
