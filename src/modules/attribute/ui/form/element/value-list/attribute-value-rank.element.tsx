import { Input } from "@medusajs/ui";
import { forwardRef, type ComponentProps } from "react";

type AttributeValueRankElementProps = ComponentProps<typeof Input>;

export const AttributeValueRankElement = forwardRef<
  HTMLInputElement,
  AttributeValueRankElementProps
>((props, ref) => {
  const { children, ...rest } = props;
  return <Input ref={ref} {...rest} type="number" placeholder="0" />;
});
