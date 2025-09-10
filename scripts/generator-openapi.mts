//  scripts/generator-openapi.mts
import { generateFullSpec } from "./openapi-generator/spec-generator.ts";

generateFullSpec().catch((err) => {
  console.error("\n❌ Critical error during spec generation:", err);
  process.exit(1);
});