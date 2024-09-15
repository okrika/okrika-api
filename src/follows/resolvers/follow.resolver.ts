import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FollowService } from "../services/follow.service";
import { User } from "src/users/models/user.model";
import { CurrentUser } from "src/authentication/decorators/current-user.decorator";
import GraphQLObjectId from "graphql-type-object-id";
import { Types } from "mongoose";
import { FollowsResponse } from "../responses/followers.response";
import { FollowsFilterInput } from "../inputs/followers-filter.input";
import { UseGuards } from "@nestjs/common";
import { Guard } from "src/authentication/guards/authentication.guard";

@UseGuards(Guard)
@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => User)
  async followOrUnfollowUser(
    @CurrentUser() user: User,
    @Args("followed", { type: () => GraphQLObjectId }) followed: Types.ObjectId
  ) {
    return await this.followService.followOrUnfollowUser(user, followed);
  }

  @Query(() => FollowsResponse)
  async getFollowers(
    @CurrentUser() user: User,
    @Args({ name: "filter", type: () => FollowsFilterInput, nullable: false })
    filter?: FollowsFilterInput
  ) {
    return await this.followService.getFollowers(user._id, filter);
  }

  @Query(() => FollowsResponse)
  async getFollowing(
    @CurrentUser() user: User,
    @Args({ name: "filter", type: () => FollowsFilterInput, nullable: false })
    filter?: FollowsFilterInput
  ) {
    return await this.followService.getFollowing(user._id, filter);
  }
}
