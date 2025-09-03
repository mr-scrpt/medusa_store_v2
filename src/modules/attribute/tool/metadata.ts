export const getMetadata = (metadata: string | undefined) => {
  return metadata ? JSON.parse(metadata) : {};
};
