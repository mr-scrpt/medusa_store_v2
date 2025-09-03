import { Input } from "@medusajs/ui";
import { forwardRef, type ComponentProps } from "react";

type AttributeNameElementProps = ComponentProps<typeof Input>;

export const AttributeNameElement = forwardRef<
  HTMLInputElement,
  AttributeNameElementProps
>((props, ref) => {
  const { children, ...rest } = props;
  return <Input ref={ref} {...rest} placeholder="e.g. Color" />;
});
