import {
  FilterQuery,
  HydratedDocument,
  PopulateOptions,
  ProjectionType,
  QueryOptions
} from "mongoose";

export interface PaginationResult<T> {
  totalCount: number;
  totalPages: number;
  list: Omit<HydratedDocument<T, object, object>, never>[] | Partial<T>[];
}

export type PaginationQuery<T> = FilterQuery<T> & {
  page?: string | number;
  take?: string | number;
  sort?: QueryOptions<T>["sort"];
  populate?: string | string[] | PopulateOptions | PopulateOptions[];
  projection?: ProjectionType<T>;
};
