import { toast } from "@medusajs/ui";
import { useMutation } from "@tanstack/react-query";
import { attributeApi } from "../../api/endpoint.api";
import { AttributeRelationCreatePayload } from "../../interface.type";

type UseAttributeCreateFabricProps = {
  onSuccess: () => void;
  onError: () => void;
};
const useAttributeCreateFabric =
  ({ onSuccess, onError }: UseAttributeCreateFabricProps) =>
  () => {
    const { mutateAsync, ...rest } = useMutation({
      mutationFn: async (data: AttributeRelationCreatePayload) => {
        return attributeApi.create(data);
      },
      onSuccess,
      onError,
    });
    return { createAttribute: mutateAsync, ...rest };
  };

export const useAttributeCreateMutation = useAttributeCreateFabric({
  onSuccess: () => {
    toast.success("Attribute created successfully");
  },
  onError: () => toast.error("Failed to create attribute"),
});
