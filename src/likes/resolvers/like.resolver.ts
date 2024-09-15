import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { Guard } from "../../authentication/guards/authentication.guard";
import { User } from "../../users/models/user.model";
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import GraphQLObjectId from "graphql-type-object-id/dist";
import { Types } from "mongoose";
import { LikeService } from "../services/like.service";
import { Product } from "src/products/models/product.model";

@UseGuards(Guard)
@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => Product)
  async likeOrUnlikeProduct(
    @CurrentUser() user: User,
    @Args({ name: "product", type: () => GraphQLObjectId })
    product: Types.ObjectId
  ) {
    return await this.likeService.likeOrUnlikeProduct(product, user);
  }
}
