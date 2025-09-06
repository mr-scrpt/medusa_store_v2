//  src/modules/attribute/ui/form/attribute-form-update.tsx
import { Container, Heading } from "@medusajs/ui";
import { AttributeFrom } from ".";
import { useAttributeFormUpdate } from "./hook/use-attribute-form-update";
import { AttributeFormUpdateProps } from "./type";

export const AttributeFormUpdate = (props: AttributeFormUpdateProps) => {
  const { callbackUrl, attributeId, onSuccess, onError, ...rest } = props;
  // const { formValues } = useAttributeFormUpdate({ attributeId });
  // const { handleAttributeCreate, isPending, isError } =
  //   useAttributeUpdateHandler({
  //     onSuccess,
  //     onError,
  //     callbackUrl,
  //   });

  return (
    <Container>
      <Heading level="h1">Create Attribute</Heading>

      <AttributeFrom
        className="flex flex-col gap-y-4"
        onSubmitForm={(data) => console.log(data)}
        defaultValues={{}}
      >
        <div className="grid grid-cols-2 gap-x-4">
          <AttributeFrom.FieldName />
          <AttributeFrom.FieldHandle />
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <AttributeFrom.FieldType />
          <AttributeFrom.FieldIsFilterable />
        </div>

        <AttributeFrom.FieldJSONView />

        <Heading level="h2">Values</Heading>

        <AttributeFrom.FieldValuesList />

        <div className="flex justify-end mt-4">
          <AttributeFrom.ButtonSubmit
            isPending={false}
            submitText="Create Attribute"
          />
        </div>
      </AttributeFrom>
    </Container>
  );
};
