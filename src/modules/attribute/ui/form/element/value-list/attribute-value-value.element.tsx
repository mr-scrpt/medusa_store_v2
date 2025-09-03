import { Input } from "@medusajs/ui";
import { ComponentProps, forwardRef } from "react";

type AttributeValueValueElementProps = ComponentProps<typeof Input>;

export const AttributeValueValueElement = forwardRef<
  HTMLInputElement,
  AttributeValueValueElementProps
>((props, ref) => {
  const { children, ...rest } = props;
  return <Input ref={ref} {...rest} placeholder="e.g. #FF0000" />;
});
