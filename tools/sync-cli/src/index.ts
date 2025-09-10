import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import merge from 'deepmerge';
import { config } from './config.ts';
import { generateLocalSpec } from './lib/local-spec-generator.ts';
import { buildUnifiedSpecFromGithub } from './lib/github-spec-merger.ts';
import { generateCleanCollection } from './lib/postman-converter.ts';
import { updateCollection, createCollection } from './lib/postman-api.ts';

const program = new Command();

/**
 * Главная функция синхронизации с Postman.
 * Принимает готовую коллекцию, пытается обновить ее. Если не находит, создает новую.
 */
async function syncCollectionToPostman(postmanCollection: any) {
  if (!config.POSTMAN_API_KEY) {
    console.error("\n❌ ERROR: POSTMAN_API_KEY is not defined.");
    return;
  }

  try {
    // Сначала пытаемся обновить коллекцию, если есть ID
    if (config.POSTMAN_COLLECTION_ID) {
      await updateCollection(config.POSTMAN_COLLECTION_ID, postmanCollection);
    } else {
      console.warn("🤔 POSTMAN_COLLECTION_ID is not defined. A new collection will be created.");
      const newId = await createCollection(postmanCollection);
      console.log("\n❗ ACTION REQUIRED: A new collection was created.");
      console.log(`Please update the POSTMAN_COLLECTION_ID in your .env file to: ${newId}`);
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`🤔 Collection with ID ${config.POSTMAN_COLLECTION_ID} not found. Creating a new one...
`);
      const newId = await createCollection(postmanCollection);
      console.log("\n❗ ACTION REQUIRED: A new collection was created.");
      console.log(`Please update the POSTMAN_COLLECTION_ID in your .env file to: ${newId}`);
    } else {
      console.error("\n❌ An unexpected error occurred during the sync process:");
      console.error(error.response?.data || error.message);
    }
  }
}

program
  .name('sync-cli')
  .description('A CLI tool to generate and sync OpenAPI specs with Postman.')
  .version('1.0.0');

program
  .command('github-sync')
  .description('Generate from GitHub spec and sync with Postman.')
  .action(async () => {
    console.log("--- Running GitHub Sync ---");
    try {
      const unifiedSpec = await buildUnifiedSpecFromGithub();
      const postmanCollection = await generateCleanCollection(unifiedSpec);
      await syncCollectionToPostman(postmanCollection);
      console.log("\n🏁 GitHub Sync process finished.");
    } catch (error) {
      console.error("\n❌ Error during github-sync:", error);
    }
  });

program
  .command('local-sync')
  .description('Generate from local source code and sync with Postman.')
  .action(async () => {
    console.log("--- Running Local Sync ---");
    try {
      const localSpec = await generateLocalSpec();
      const postmanCollection = await generateCleanCollection(localSpec);
      await syncCollectionToPostman(postmanCollection);
      console.log("\n🏁 Local Sync process finished.");
    } catch (error) {
      console.error("\n❌ Error during local-sync:", error);
    }
  });

program
  .command('full-sync')
  .description('Generate from both local code and GitHub, merge, and sync.')
  .action(async () => {
    console.log("--- Running Full Sync ---");
    try {
      const localSpec = await generateLocalSpec();
      const githubSpec = await buildUnifiedSpecFromGithub();
      
      console.log("🔄 Merging local and GitHub specs...");
      const mergedSpec = merge(githubSpec, localSpec);

      const postmanCollection = await generateCleanCollection(mergedSpec);
      await syncCollectionToPostman(postmanCollection);
      console.log("\n🏁 Full Sync process finished.");
    } catch (error) {
      console.error("\n❌ Error during full-sync:", error);
    }
  });

program.parse(process.argv);
