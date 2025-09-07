//  src/admin/routes/attribute/edit/[id]/page.tsx
import { Container, Heading } from "@medusajs/ui";

import { AttributeFormUpdate } from "@/modules/attribute/interface.client";
import { PAGE_ATTRIBUTE_ROUTES } from "@/modules/attribute/interface.type";
import { useParams } from "react-router-dom";

const AttributeEdit = ({ params }: { params: { id: string } }) => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return null;
  }
  console.log("output_log:  =>>>", id);
  return (
    <Container>
      <Heading level="h1">Create Attribute</Heading>
      <AttributeFormUpdate
        attributeId={id}
        callbackUrl={PAGE_ATTRIBUTE_ROUTES.BASE}
        onSuccess={() => console.log("DEBUG: Success create attribute")}
        onError={() => console.log("DEBUG: Error create attribute")}
      />
    </Container>
  );
};

export default AttributeEdit;
