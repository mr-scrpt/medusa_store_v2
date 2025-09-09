
const config = require("./config");
const fs = require("fs/promises"); 
const path = require("path");       
const { updateCollection, createCollection } = require("./api/postman");
const { buildUnifiedSpec } = require("./lib/openapi-merger");
const { generateCleanCollection } = require("./lib/postman-converter");

async function main() {
  console.log("--- Postman Sync Script ---");

  
  if (!config.POSTMAN_COLLECTION_ID) {
    console.error("\n❌ ERROR: POSTMAN_COLLECTION_ID is not defined in your .env file.");
    console.error("Please add it to proceed. If you don't have one, you can run the 'create-collection' script first.");
    return; 
  }
  
  if (!config.POSTMAN_API_KEY) {
    console.error("\n❌ ERROR: POSTMAN_API_KEY is not defined.");
    return;
  }

  try {
    
    const unifiedSpec = await buildUnifiedSpec();
    const postmanCollection = await generateCleanCollection(unifiedSpec);

    
    console.log(`💾 Saving collection to local file: ${config.OUTPUT_FILE_PATH}...`);
    await fs.mkdir(path.dirname(config.OUTPUT_FILE_PATH), { recursive: true });
    await fs.writeFile(
      config.OUTPUT_FILE_PATH,
      JSON.stringify(postmanCollection, null, 2)
    );
    console.log("📄 File saved successfully.");
    
    await updateCollection(config.POSTMAN_COLLECTION_ID, postmanCollection);

  } catch (error) {
    
    if (error.response?.status === 404) {
      console.warn(`🤔 Collection with ID ${config.POSTMAN_COLLECTION_ID} not found.`);
      
      const unifiedSpec = await buildUnifiedSpec();
      const postmanCollection = await generateCleanCollection(unifiedSpec);
      const newId = await createCollection(postmanCollection);
      
      console.log("-".repeat(50));
      console.log("❗ ACTION REQUIRED: A new collection was created.");
      console.log(`Please update the POSTMAN_COLLECTION_ID in your .env file to:`);
      console.log(newId);
      console.log("-".repeat(50));
      
    } else {
      console.error("\n❌ An unexpected error occurred during the sync process:");
      console.error(error.response?.data || error.message);
    }
  }
  console.log("\n🏁 Sync process finished.");
}

main();
