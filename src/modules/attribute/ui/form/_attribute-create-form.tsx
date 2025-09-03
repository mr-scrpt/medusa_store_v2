import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Heading, Input, Select, Text } from "@medusajs/ui";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { JsonViewSection } from "@/shared/ui/kit/json-view-section/json-view-section";
import {
  AttributeRelationCreateForm,
  AttributeRelationCreateFormSchema,
  defaultAttributeRelationCreateForm,
} from "../../domain/from-create.schema";
import { useAttributeCreateHandler } from "./handler/use-attribute-create.handler";
import {
  PAGE_ATTRIBUTE_ROUTES,
  AttributeFieldType,
} from "../../interface.type";

export const AttributeCreateForm = () => {
  const form = useForm<AttributeRelationCreateForm>({
    resolver: zodResolver(AttributeRelationCreateFormSchema),
    defaultValues: {
      ...defaultAttributeRelationCreateForm,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "valueListData",
  });

  const { handleAttributeCreate, isPending, isError } =
    useAttributeCreateHandler({
      onSuccess: () => {
        console.log("output_log: %%%%%%%%%%%%% =>>> OLOLOLO");
      },
      callbackUrl: PAGE_ATTRIBUTE_ROUTES.BASE,
      onError: () => {
        console.log("output_log: %%%%%%%%%%%%% =>>> OLOLOLO");
      },
    });

  const { errors } = form.formState;

  return (
    <Container>
      <Heading level="h1">Create Attribute</Heading>
      <form
        onSubmit={form.handleSubmit(handleAttributeCreate)}
        className="flex flex-col gap-y-4"
      >
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <Input
              {...form.register("attributeData.name")}
              placeholder="e.g. Color"
            />
            <div className="h-6 pt-1">
              {errors.attributeData?.name && (
                <Text className="text-ui-fg-error text-xs">
                  {errors.attributeData.name.message}
                </Text>
              )}
            </div>
          </div>
          <div>
            <Input
              {...form.register("attributeData.handle")}
              placeholder="e.g. color"
            />
            <div className="h-6 pt-1">
              {errors.attributeData?.handle && (
                <Text className="text-ui-fg-error text-xs">
                  {errors.attributeData.handle.message}
                </Text>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Controller
            control={form.control}
            name="attributeData.type"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {Object.entries(AttributeFieldType).map(([key, type]) => (
                    <Select.Item key={type} value={type}>
                      {key}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            )}
          />
          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              {...form.register("attributeData.filterable")}
              id="filterable"
            />
            <label htmlFor="filterable" className="text-ui-fg-subtle text-sm">
              Filterable
            </label>
          </div>
        </div>

        {}
        <div>
          <JsonViewSection
            title="Metadata"
            data={form.watch("attributeData.metadata")}
            editable={true}
            onSave={(value) => form.setValue("attributeData.metadata", value)}
          />
          <div className="h-6 pt-1">
            {errors.attributeData?.metadata && (
              <Text className="text-ui-fg-error text-xs">
                {errors.attributeData.metadata.message}
              </Text>
            )}
          </div>
        </div>

        <Heading level="h2">Values</Heading>
        <div className="flex flex-col gap-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-3 items-start gap-x-4"
            >
              <div>
                <Input
                  {...form.register(`valueListData.${index}.name`)}
                  placeholder="e.g. Red"
                />
                <div className="h-6 pt-1">
                  {errors.valueListData?.[index]?.name && (
                    <Text className="text-ui-fg-error text-xs">
                      {errors.valueListData[index]?.name?.message}
                    </Text>
                  )}
                </div>
              </div>
              <div>
                <Input
                  {...form.register(`valueListData.${index}.value`)}
                  placeholder="e.g. #FF0000"
                />
                <div className="h-6 pt-1">
                  {errors.valueListData?.[index]?.value && (
                    <Text className="text-ui-fg-error text-xs">
                      {errors.valueListData[index]?.value?.message}
                    </Text>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <Input
                    {...form.register(`valueListData.${index}.rank`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    defaultValue={0}
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="danger"
                  >
                    Remove
                  </Button>
                </div>
                <div className="h-6 pt-1" /> {}
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          onClick={() => append({ name: "", value: "", rank: 0, metadata: "" })}
        >
          Add Value
        </Button>

        {}
        <div className="flex justify-end mt-4">
          <Button type="submit" isLoading={isPending}>
            Create Attribute
          </Button>
        </div>
      </form>
    </Container>
  );
};
