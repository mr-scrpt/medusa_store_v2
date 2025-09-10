export function cleanGeneratedRequests(items: any[] | undefined) {
  if (!items || !Array.isArray(items)) return;
  items.forEach((item) => {
    if (item.request) {
      delete item.request.auth;
      if (item.request.url && item.request.url.query) {
        item.request.url.query = [];
      }
    }
    if (item.item) {
      cleanGeneratedRequests(item.item);
    }
  });
}
