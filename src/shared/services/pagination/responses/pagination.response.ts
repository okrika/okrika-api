import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PaginationResponse<T> {
  constructor(array: T[], totalCount: number, totalPages: number) {
    this.list = array;
    this.totalPages = totalPages;
    this.totalCount = totalCount;
  }

  @Field(() => Number)
  totalPages: number;

  @Field(() => Number)
  totalCount: number;

  list: T[];
}
