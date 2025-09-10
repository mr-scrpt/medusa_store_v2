import { convert } from "openapi-to-postmanv2";
import { config } from "../config.ts";
import { addCustomizations } from "./postman-processors/customizations.ts";
import { addSetupRequests } from "./postman-processors/setup-requests.ts";
import { normalizeRequestUrls } from "./postman-processors/url-normalizer.ts";
import { cleanGeneratedRequests } from "./postman-processors/request-cleaner.ts";
import { replaceBodyPlaceholders } from "./postman-processors/body-mock-generator.ts";

export async function generateCleanCollection(spec: any): Promise<any> {
  console.log("🔄 Converting OpenAPI spec to Postman collection...");
  const converterOptions = {
    disableOptionalParameters: true,
    folderStrategy: "Tags" as const,
  };

  const conversionResult = await new Promise<any>((resolve, reject) => {
    convert({ type: "json", data: spec }, converterOptions, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

  if (!conversionResult.result) {
    throw new Error(`Postman conversion failed: ${conversionResult.reason}`);
  }

  let finalCollection = conversionResult.output[0].data;

  // --- Конвейер обработки коллекции ---

  // 1. Добавляем кастомную аутентификацию и переменные
  finalCollection = addCustomizations(
    finalCollection,
    config.MEDUSA_ADMIN_EMAIL,
    config.MEDUSA_ADMIN_PASSWORD,
  );

  // 2. Нормализуем URL, чтобы они использовали {{base_url}}
  finalCollection = normalizeRequestUrls(finalCollection);

  // 3. Очищаем сгенерированные запросы от лишних параметров
  console.log("🧼 Cleaning up generated requests (auth & query params)...");
  cleanGeneratedRequests(finalCollection.item);

  // 4. Заменяем плейсхолдеры в теле запросов на моковые данные Postman
  finalCollection = replaceBodyPlaceholders(finalCollection);

  // 5. Добавляем setup-запросы для получения ID ресурсов
  finalCollection = addSetupRequests(finalCollection);

  console.log("✅ Collection generated and customized successfully.");
  return finalCollection;
}