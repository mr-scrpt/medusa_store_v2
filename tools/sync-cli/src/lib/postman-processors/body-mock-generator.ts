import { mockTemplates } from "./mock-templates.ts";

// Рекурсивная функция для обхода и замены значений в объекте JSON
function traverseAndMock(obj: any) {
  if (!obj) return;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === "string") {
        const match = value.match(/^<(.+)>$/);
        if (match) {
          const type = match[1].split("|")[0].trim(); // Берем первый тип, если есть объединение, e.g. <string | null>

          // Специальная обработка для поля metadata
          if (key === "metadata") {
            obj[key] = "{}";
          } else if (key === "type") {
            // Поле type должно быть одним из значений enum
            obj[key] = "single"; // Хардкодим одно из валидных значений
          } else if (mockTemplates[type]) {
            obj[key] = mockTemplates[type];
          }
        }
      } else if (typeof value === "object") {
        // Рекурсивно обходим вложенные объекты или массивы
        traverseAndMock(value);
      }
    }
  }
}

// Основная функция, которая обходит коллекцию Postman
function traverseItems(items: any[]) {
  if (!items || !Array.isArray(items)) return;

  items.forEach((item) => {
    // Если это папка, рекурсивно идем вглубь
    if (item.item) {
      traverseItems(item.item);
    }

    // Если это запрос с телом
    if (item.request?.body?.raw) {
      try {
        const bodyObject = JSON.parse(item.request.body.raw);
        traverseAndMock(bodyObject);
        // Обновляем тело запроса с красивым форматированием
        item.request.body.raw = JSON.stringify(bodyObject, null, 2);
      } catch (e) {
        // Игнорируем ошибки парсинга, если тело - не JSON
      }
    }
  });
}

export function replaceBodyPlaceholders(collection: any): any {
  console.log("🔄 Replacing request body placeholders with mock data...");
  if (collection.item) {
    traverseItems(collection.item);
  }
  console.log("✅ Body placeholders replaced.");
  return collection;
}
