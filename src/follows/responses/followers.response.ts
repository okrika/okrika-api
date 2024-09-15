import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationResponse } from "../../shared/services/pagination/responses/pagination.response";
import GraphQLObjectId from "graphql-type-object-id/dist";

@ObjectType()
export class Follow {
  @Field(() => GraphQLObjectId)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  avatar?: string;
}

@ObjectType()
export class FollowsResponse extends PaginationResponse<Follow> {
  constructor(users: Follow[], totalCount: number, totalPages: number) {
    super(users, totalCount, totalPages);
  }
  @Field(() => [Follow])
  list: Follow[];
}
