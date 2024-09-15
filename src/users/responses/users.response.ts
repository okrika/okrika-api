import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../models/user.model";
import { PaginationResponse } from "../../shared/services/pagination/responses/pagination.response";

@ObjectType()
export class UsersResponse extends PaginationResponse<User> {
  constructor(users: User[], totalCount: number, totalPages: number) {
    super(users, totalCount, totalPages);
  }

  @Field(() => [User])
  list: User[];
}
