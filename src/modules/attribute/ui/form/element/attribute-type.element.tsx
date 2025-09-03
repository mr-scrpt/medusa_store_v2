import { AttributeFieldType } from "@/modules/attribute/interface.type";
import { Select } from "@medusajs/ui";
import React, { type ComponentProps } from "react";

type AttributeTypeElementProps = ComponentProps<typeof Select> & {
  onChange?: (value: string) => void;
};

export const AttributeTypeElement = React.forwardRef<
  HTMLButtonElement,
  AttributeTypeElementProps
>((props, ref) => {
  const { onChange, value, ...rest } = props;

  return (
    <Select value={value} onValueChange={onChange} {...rest}>
      {}
      <Select.Trigger ref={ref}>
        {" "}
        {}
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {Object.entries(AttributeFieldType).map(([key, type]) => (
          <Select.Item key={type} value={type}>
            {key}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
});
