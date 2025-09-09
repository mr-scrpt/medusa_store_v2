//  src/modules/attribute/ui/form/hook/use-attribute-form-update.tsx
import { buildAttributeToForm } from "@/modules/attribute/models/form/attribute-form.model";
import { useMemo } from "react";
import { useAttributeWithValueListQuery } from "../../../models/query/use-attribute.query";

type UseAttributeFormUpdateProps = {
  attributeId: string;
};

export const useAttributeFormUpdate = (props: UseAttributeFormUpdateProps) => {
  const { attributeId } = props;
  const { attributeData, ...rest } = useAttributeWithValueListQuery({
    attributeId,
  });

  const formValues = useMemo(
    () => buildAttributeToForm(attributeData),
    [attributeData],
  );
  console.log("output_log: FORM VALUES =>>>", formValues);

  return {
    formValues,
    ...rest,
  };
};
