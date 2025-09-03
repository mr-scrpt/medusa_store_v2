import { Checkbox } from "@medusajs/ui";
import { forwardRef, type ComponentProps } from "react";

type AttributeIsFilterableElementProps = ComponentProps<typeof Checkbox>;

export const AttributeIsFilterableElement = forwardRef<
  HTMLButtonElement,
  AttributeIsFilterableElementProps
>((props, ref) => {
  const { children, ...rest } = props;
  return <Checkbox ref={ref} {...rest} />;
});
