import { Input } from "@medusajs/ui";
import { ComponentProps, forwardRef } from "react";

type AttributeHandleElementProps = ComponentProps<typeof Input>;

export const AttributeHandleElement = forwardRef<
  HTMLInputElement,
  AttributeHandleElementProps
>((props, ref) => {
  const { children, ...rest } = props;

  return <Input ref={ref} {...rest} placeholder="e.g. Color" />;
});
