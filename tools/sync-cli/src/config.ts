import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из корневого .env файла
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  // URL для базовой спецификации OpenAPI (стабильная версия с GitHub)
  MEDUSA_ADMIN_OAS_URL: "https://raw.githubusercontent.com/medusajs/medusa/639ecdfd7439fb45445022f0a850580550c5a633/www/apps/api-reference/specs/admin/openapi.full.yaml",
  
  // Паттерн для поиска кастомных .oas.yaml файлов (из старой логики)
  CUSTOM_SPECS_PATTERN: "src/**/*.oas.yaml",

  // Путь для сохранения итоговой коллекции Postman
  POSTMAN_COLLECTION_OUTPUT_PATH: "postman/output/postman_collection.json",

  // Путь для сохранения OpenAPI спецификации, сгенерированной из локального кода
  LOCAL_OPENAPI_OUTPUT_PATH: "postman/openapi.full.yaml",

  // Ключи API и ID коллекции из переменных окружения
  POSTMAN_API_KEY: process.env.POSTMAN_API_KEY,
  POSTMAN_COLLECTION_ID: process.env.POSTMAN_COLLECTION_ID,
  
  // Данные для авторизации в Medusa (для кастомного запроса логина)
  MEDUSA_ADMIN_EMAIL: process.env.MEDUSA_ADMIN_EMAIL,
  MEDUSA_ADMIN_PASSWORD: process.env.MEDUSA_ADMIN_PASSWORD,

  // API ключ Medusa (если используется)
  MEDUSA_API_KEY: process.env.MEDUSA_API_KEY, 
};
