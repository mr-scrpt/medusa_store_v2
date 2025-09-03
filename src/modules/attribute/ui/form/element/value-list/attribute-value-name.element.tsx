import { Input } from "@medusajs/ui";
import { forwardRef, type ComponentProps } from "react";

type AttributeValueNameElementProps = ComponentProps<typeof Input>;

export const AttributeValueNameElement = forwardRef<
  HTMLInputElement,
  AttributeValueNameElementProps
>((props, ref) => {
  const { children, ...rest } = props;
  return <Input ref={ref} {...rest} placeholder="e.g. Red" />;
});
