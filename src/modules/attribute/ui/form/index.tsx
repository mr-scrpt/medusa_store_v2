//  src/modules/attribute/ui/form/index.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@medusajs/icons";
import { Button, Label, Text } from "@medusajs/ui";
import cx from "classnames";
import { ComponentProps, useEffect } from "react";
import {
  Controller,
  DefaultValues,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { ZodTypeAny } from "zod";
import { AttributeHandleElement } from "./element/attribute-handle.element";
import { AttributeIsFilterableElement } from "./element/attribute-is-filterable.element";
import { AttributeJSONViewElement } from "./element/attribute-json-view.element";
import { AttributeNameElement } from "./element/attribute-name.element";
import { AttributeTypeElement } from "./element/attribute-type.element";
import { AttributeValueListElement } from "./element/value-list/attribute-vlaue-list.element";
import { ButtonSubmitProps } from "@/shared/lib/react-hook-form";
import {
  AttributeRelationCreateForm,
  AttributeRelationCreateFormSchema,
} from "../../domain/from-create.schema";
import { getAttributeRelationCreateFormDefaultValues } from "../../models/form/attribute-form.model";

type AttributeFromCreateProps<T extends AttributeRelationCreateForm> =
  ComponentProps<"div"> & {
    onSubmitForm: (data: T) => void;
    schema?: ZodTypeAny;
    defaultValues?: DefaultValues<T>;
  };

type AttributeFormComponent = <T extends AttributeRelationCreateForm>(
  props: AttributeFromCreateProps<T>,
) => React.ReactElement;

type AttributeFormFields = {
  FieldName: (props: ComponentProps<"div">) => React.ReactElement;
  FieldHandle: (props: ComponentProps<"div">) => React.ReactElement;
  FieldType: (props: ComponentProps<"div">) => React.ReactElement;
  FieldIsFilterable: (props: ComponentProps<"div">) => React.ReactElement;
  FieldValuesList: (props: ComponentProps<"div">) => React.ReactElement;
  FieldJSONView: (props: ComponentProps<"div">) => React.ReactElement;
  ButtonSubmit: (props: ButtonSubmitProps) => React.ReactElement;
};

// 3. Объединяем их в один тип
type AttributeFromType = AttributeFormComponent & AttributeFormFields;

export const AttributeFrom: AttributeFromType = <
  T extends AttributeRelationCreateForm,
>(
  props: AttributeFromCreateProps<T>,
) => {
  const { children, className, onSubmitForm, defaultValues, schema, ...rest } =
    props;

  const form = useForm<T>({
    resolver: zodResolver(schema || AttributeRelationCreateFormSchema),
    defaultValues:
      getAttributeRelationCreateFormDefaultValues<T>(defaultValues),
  });

  useEffect(() => {
    form.reset(getAttributeRelationCreateFormDefaultValues<T>(defaultValues));
  }, [defaultValues, form]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className={cx("flex flex-col gap-4", className)}
      >
        {children}
      </form>
    </FormProvider>
  );
};

AttributeFrom.FieldName = (props) => {
  const { className } = props;
  const { control } = useFormContext<AttributeRelationCreateForm>();
  return (
    <Controller
      control={control}
      name="attributeData.name"
      render={({ field, fieldState }) => (
        <div className={cx("flex flex-col gap-2", className)}>
          <Label size="small" weight="plus">
            Attribute Name
          </Label>
          <AttributeNameElement {...field} />
          <Text className="text-rose-600">{fieldState.error?.message}</Text>
        </div>
      )}
    />
  );
};

AttributeFrom.FieldHandle = (props) => {
  const { className } = props;
  const { control } = useFormContext<AttributeRelationCreateForm>();
  return (
    <Controller
      control={control}
      name="attributeData.handle"
      render={({ field, fieldState }) => (
        <div className={cx("flex flex-col gap-2", className)}>
          <Label size="small" weight="plus">
            Attribute Handle
          </Label>
          <AttributeHandleElement {...field} />
          <Text className="text-rose-600">{fieldState.error?.message}</Text>
        </div>
      )}
    />
  );
};

AttributeFrom.FieldType = (props) => {
  const { className } = props;
  const { control } = useFormContext<AttributeRelationCreateForm>();
  return (
    <Controller
      control={control}
      name="attributeData.type"
      render={({ field, fieldState }) => (
        <div className={cx("flex flex-col gap-2", className)}>
          <Label size="small" weight="plus">
            Attribute Type
          </Label>
          <AttributeTypeElement {...field} />
          <Text className="text-rose-600">{fieldState.error?.message}</Text>
        </div>
      )}
    />
  );
};

// type AttributeIsFilterableElementProps = ComponentProps<"div">;
AttributeFrom.FieldIsFilterable = (props) => {
  const { className } = props;
  const { control } = useFormContext<AttributeRelationCreateForm>();
  return (
    <Controller
      control={control}
      name="attributeData.filterable"
      render={({ field, fieldState }) => (
        <div className={cx("flex flex-col gap-2", className)}>
          <Label size="small" weight="plus">
            Is Filterable?
          </Label>
          <AttributeIsFilterableElement
            id="filterable"
            checked={!!field.value}
            onCheckedChange={(val) => field.onChange(val === true)}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />

          <Text className="text-rose-600">{fieldState.error?.message}</Text>
        </div>
      )}
    />
  );
};

AttributeFrom.FieldJSONView = (props) => {
  const { className } = props;
  const { control } = useFormContext<AttributeRelationCreateForm>();
  return (
    <Controller
      control={control}
      name="attributeData.metadata"
      render={({ field, fieldState }) => (
        <div className={cx("flex flex-col gap-2", className)}>
          <Label size="small" weight="plus">
            Attribute JSON View
          </Label>
          <AttributeJSONViewElement
            data={field.value}
            onSave={field.onChange}
          />
          <Text className="text-rose-600">{fieldState.error?.message}</Text>
        </div>
      )}
    />
  );
};

AttributeFrom.FieldValuesList = (props) => {
  const { className } = props;
  const { control } = useFormContext<AttributeRelationCreateForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "valueListData",
  });
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <Label size="small" weight="plus">
        Attribute Values
      </Label>
      <AttributeValueListElement
        fields={fields}
        onAppend={append}
        onRemove={remove}
      />
    </div>
  );
};

AttributeFrom.ButtonSubmit = (props) => {
  const { isPending, submitText, ...rest } = props;

  return (
    <Button type="submit" disabled={isPending} {...rest}>
      {isPending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
      {submitText}
    </Button>
  );
};
