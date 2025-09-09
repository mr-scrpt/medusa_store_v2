//  postman/api/postman.js
const axios = require("axios");
const config = require("../config");

const postmanClient = axios.create({
  baseURL: "https://api.getpostman.com",
  headers: { "X-Api-Key": config.POSTMAN_API_KEY },
});

async function updateCollection(collectionId, collectionData) {
  console.log(`🔄 Updating Postman collection (ID: ${collectionId})...`);
  await postmanClient.put(`/collections/${collectionId}`, { collection: collectionData });
  console.log("✨ Collection updated successfully!");
}

async function createCollection(collectionData) {
  console.log(`✨ Creating new Postman collection named "${collectionData.info.name}"...`);
  const response = await postmanClient.post("/collections", { collection: collectionData });
  return response.data.collection.uid; // Возвращаем ID новой коллекции
}

module.exports = { updateCollection, createCollection };
