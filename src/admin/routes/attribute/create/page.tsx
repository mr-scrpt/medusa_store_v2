import { Container, Heading } from "@medusajs/ui";

import { AttributeFormCreate } from "@/modules/attribute/interface.client";
import { PAGE_ATTRIBUTE_ROUTES } from "@/modules/attribute/interface.type";

const AttributeCreate = () => {
  return (
    <Container>
      <Heading level="h1">Create Attribute</Heading>
      <AttributeFormCreate
        callbackUrl={PAGE_ATTRIBUTE_ROUTES.BASE}
        onSuccess={() => console.log("DEBUG: Success create attribute")}
        onError={() => console.log("DEBUG: Error create attribute")}
      />
    </Container>
  );
};

export default AttributeCreate;
