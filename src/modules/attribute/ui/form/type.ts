import { ComponentProps } from "react";

export type AttributeFormDefaultProps = ComponentProps<"div"> & {
  callbackUrl?: string;
  onSuccess?: () => void;
  onError?: () => void;
};

export type AttributeFormCreateProps = AttributeFormDefaultProps;
export type AttributeFormUpdateProps = AttributeFormDefaultProps & {
  attributeId: string;
};
