import axios from 'axios';
import { config } from '../config.ts';

const postmanClient = axios.create({
  baseURL: "https://api.getpostman.com",
  headers: { "X-Api-Key": config.POSTMAN_API_KEY },
});

/**
 * Обновляет существующую коллекцию в Postman.
 * @param {string} collectionId ID коллекции для обновления.
 * @param {any} collectionData Данные коллекции.
 */
export async function updateCollection(collectionId: string, collectionData: any): Promise<void> {
  console.log(`🔄 Updating Postman collection (ID: ${collectionId})...`);
  await postmanClient.put(`/collections/${collectionId}`, { collection: collectionData });
  console.log("✨ Collection updated successfully!");
}

/**
 * Создает новую коллекцию в Postman.
 * @param {any} collectionData Данные для создания коллекции.
 * @returns {Promise<string>} ID новой созданной коллекции.
 */
export async function createCollection(collectionData: any): Promise<string> {
  console.log(`✨ Creating new Postman collection named \"${collectionData.info.name}\"...`);
  const response = await postmanClient.post("/collections", { collection: collectionData });
  return response.data.collection.uid;
}
