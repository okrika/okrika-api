import { PaginationResult } from "./index.interface";

/**
 * This is a function that paginates data.
 * @param array The data to paginate
 * @param page The current page to view
 * @param take The number of items per page
 */

export function paginate<T>(
  array: T[],
  page: string | number,
  take?: string | number
): PaginationResult<T> {
  const limit = Number(take || "20");

  const skip = Number(page || "1");

  return {
    totalCount: array.length,
    totalPages: Math.ceil(array.length / limit),
    list: array.slice((skip - 1) * limit, skip * limit)
  };
}
