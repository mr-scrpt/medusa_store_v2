export function normalizeRequestUrls(collection: any): any {
  function traverseItems(item: any) {
    if (item.item && Array.isArray(item.item)) {
      item.item.forEach(traverseItems);
    } else if (item.request && item.request.url) {
      item.request.url.host = ["{{base_url}}"];
      delete item.request.url.protocol;
    }
  }
  if (collection.item) {
    traverseItems({ item: collection.item });
  }
  return collection;
}
