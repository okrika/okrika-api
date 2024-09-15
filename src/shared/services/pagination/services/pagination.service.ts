import { Injectable } from "@nestjs/common";
import { FilterQuery, Model } from "mongoose";
import { PaginationQuery } from "../interfaces/pagination.interface";
import { omit } from "lodash";
import { PaginationResponse } from "../responses/pagination.response";
import * as moment from "moment";
import { toFixed } from "src/utilities/to-fixed";

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Model<T>,
    query: PaginationQuery<T> = {}
  ): Promise<PaginationResponse<T>> {
    const limit = Number(query.take || "20");

    const skip = (Number(query.page || "1") - 1) * limit;

    const filter = omit(query, [
      "take",
      "page",
      "sort",
      "populate",
      "projection"
    ]) as FilterQuery<T>;

    const list = await repository
      .find(filter, query.projection, {
        limit,
        skip,
        sort: query.sort,
        populate: query.populate
      })
      .exec();

    const totalCount = await repository.count(filter);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      list,
      totalCount,
      totalPages
    };
  }

  async getPercentageGrowth<T>(repository: Model<T>, query: FilterQuery<T>) {
    const today = moment().toDate();

    const lastMonth = moment().subtract(1, "M").toDate();

    const last2Months = moment().subtract(2, "M").toDate();

    const lastMonthCount = await repository.count({
      ...query,
      createdAt: {
        $lt: lastMonth,
        $gte: last2Months
      }
    });

    const presentMonthCount = await repository.count({
      ...query,
      createdAt: {
        $lt: today,
        $gte: lastMonth
      }
    });

    if (lastMonthCount === 0) {
      if (presentMonthCount === 0) {
        return 0;
      }

      return 100;
    }

    return toFixed(
      ((presentMonthCount - lastMonthCount) / lastMonthCount) * 100
    );
  }
}
