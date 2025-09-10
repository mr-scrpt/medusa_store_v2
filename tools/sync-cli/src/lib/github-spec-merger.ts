import fs from "fs/promises";
import { globSync } from "glob";
import axios from "axios";
import yaml from "js-yaml";
import merge from "deepmerge";
import { config } from "../config.ts";

/**
 * Загружает базовую спецификацию с GitHub и объединяет ее с локальными файлами *.oas.yaml.
 * @returns {Promise<any>} Объединенная спецификация OpenAPI.
 */
export async function buildUnifiedSpecFromGithub(): Promise<any> {
  console.log("🚀 Building unified OpenAPI spec from GitHub...");
  
  // Загружаем базовую спецификацию
  const { data: baseSpecYaml } = await axios.get(config.MEDUSA_ADMIN_OAS_URL);
  let mergedSpec: any = yaml.load(baseSpecYaml);

  // Находим и мёржим локальные спецификации
  const customSpecFiles = globSync(config.CUSTOM_SPECS_PATTERN);
  if (customSpecFiles.length > 0) {
      console.log(`📄 Found ${customSpecFiles.length} custom spec(s) to merge.`);
      for (const file of customSpecFiles) {
        const content = await fs.readFile(file, "utf-8");
        const customSpec = yaml.load(content);
        mergedSpec = merge(mergedSpec, customSpec);
      }
  }

  console.log("✅ Unified spec from GitHub built successfully.");
  return mergedSpec;
}
