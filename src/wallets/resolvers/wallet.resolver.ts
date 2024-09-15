import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { WalletService } from "../services/wallet.service";
import { AddBankInformationInput } from "../inputs/add-bank-information.input";
import { Wallet } from "../models/wallet.model";
import { CurrentUser } from "../../authentication/decorators/current-user.decorator";
import { User } from "../../users/models/user.model";
import { UseGuards } from "@nestjs/common";
import { Guard } from "../../authentication/guards/authentication.guard";
import GraphQLObjectId from "graphql-type-object-id/dist";
import { Types } from "mongoose";

@UseGuards(Guard)
@Resolver(() => Wallet)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Mutation(() => Wallet)
  addBankInformation(
    @CurrentUser() user: User,
    @Args("input") input: AddBankInformationInput
  ) {
    return this.walletService.addBankInformation(input, user._id);
  }

  @Query(() => Wallet)
  getWallet(
    @CurrentUser() user: User,
    @Args({ name: "WalletId", type: () => GraphQLObjectId, nullable: true })
    walletId?: Types.ObjectId
  ) {
    return this.walletService.getWallet(user._id, walletId);
  }
}
