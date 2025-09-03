import { Button, Label, Text } from "@medusajs/ui";
import type { ComponentProps } from "react";
import { AttributeValueNameElement } from "./attribute-value-name.element";
import { AttributeValueRankElement } from "./attribute-value-rank.element";
import { AttributeValueValueElement } from "./attribute-value-value.element";
import { Controller } from "react-hook-form";
import cx from "classnames";

type AttributeValueRowElementProps = ComponentProps<"div"> & {
  index: number;
  onRemove: () => void;
};

export const AttributeValueRowElement = (
  props: AttributeValueRowElementProps,
) => {
  const { index, onRemove, className, ...rest } = props;

  return (
    <div
      className={cx(
        "grid grid-cols-3 items-start gap-x-4 p-4 border border-gray-200 rounded-lg",
        className,
      )}
      {...rest}
    >
      <div>
        <Label size="small">Name</Label>
        <Controller
          name={`valueListData.${index}.name`}
          render={({ field, fieldState }) => (
            <div>
              <AttributeValueNameElement {...field} />
              {fieldState.error && (
                <Text className="text-ui-fg-error text-xs">
                  {fieldState.error.message}
                </Text>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <Label size="small">Value</Label>
        <Controller
          name={`valueListData.${index}.value`}
          render={({ field, fieldState }) => (
            <div>
              <AttributeValueValueElement {...field} />
              {fieldState.error && (
                <Text className="text-ui-fg-error text-xs">
                  {fieldState.error.message}
                </Text>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex items-center gap-x-2">
        <div>
          <Label size="small">Rank</Label>
          <Controller
            name={`valueListData.${index}.rank`}
            render={({ field, fieldState }) => (
              <div>
                <AttributeValueRankElement
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && (
                  <Text className="text-ui-fg-error text-xs">
                    {fieldState.error.message}
                  </Text>
                )}
              </div>
            )}
          />
        </div>
        <Button
          type="button"
          onClick={onRemove}
          variant="danger"
          size="small"
          className="mt-6" // Выравниваем с полями
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
