import { JsonViewSection } from "@/shared/ui/kit/json-view-section/json-view-section";
import type { ComponentProps } from "react";

type AttributeJSONViewElementProps = ComponentProps<typeof JsonViewSection>;

export const AttributeJSONViewElement = (
  props: AttributeJSONViewElementProps,
) => {
  return <JsonViewSection title="Metadata" {...props} />;
};
