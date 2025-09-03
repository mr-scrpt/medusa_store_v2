import { Container, Heading } from "@medusajs/ui";
import { AttributeFrom } from ".";
import { useAttributeCreateHandler } from "./handler/use-attribute-create.handler";
import { AttributeFormCreateProps } from "./type";

export const AttributeFormCreate = (props: AttributeFormCreateProps) => {
  const { callbackUrl, onSuccess, onError, ...rest } = props;
  const { handleAttributeCreate, isPending, isError } =
    useAttributeCreateHandler({
      onSuccess,
      onError,
      callbackUrl,
    });

  return (
    <Container>
      <Heading level="h1">Create Attribute</Heading>

      <AttributeFrom
        className="flex flex-col gap-y-4"
        onSubmitForm={handleAttributeCreate}
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
            isPending={isPending}
            submitText="Create Attribute"
          />
        </div>
      </AttributeFrom>
    </Container>
  );
};
