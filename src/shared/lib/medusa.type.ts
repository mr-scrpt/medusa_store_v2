// NOTE: Request
type TimestampQueryParams = {
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type QueryParamsBase = TimestampQueryParams & {
  q?: string;
  fields?: string;
  limit?: number;
  offset?: number;
  order?: string;
};

// NOTE: Response
export type MetadataResponse = {
  count: number;
  offset: number;
  limit: number;
};
