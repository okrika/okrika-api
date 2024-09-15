import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserService } from "../services/user.service";
import { UpdateUserInput } from "../inputs/update-user.input";
import { User } from "../models/user.model";
import { UsersResponse } from "../responses/users.response";
import { UsersFilterInput } from "../inputs/users-filter.input";
import { CurrentUser } from "src/authentication/decorators/current-user.decorator";
import { UseGuards } from "@nestjs/common";
import { Guard } from "src/authentication/guards/authentication.guard";
import { Roles } from "src/authentication/guards/roles.guard";
import { AdminTypes } from "../constants/user.constant";

@UseGuards(Guard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(Guard, Roles(AdminTypes))
  @Query(() => UsersResponse)
  async getUsers(
    @Args({ name: "filter", type: () => UsersFilterInput, nullable: false })
    filter: UsersFilterInput
  ) {
    return await this.userService.getUsers(filter);
  }

  @Query(() => User)
  async getUser(
    @CurrentUser() user: User,
    @Args({ name: "username", type: () => String, nullable: true })
    username?: string
  ) {
    return await this.userService.getUser(user, username);
  }

  @Mutation(() => User)
  async updateUser(
    @CurrentUser() user: User,
    @Args({ name: "input", type: () => UpdateUserInput, nullable: false })
    input: UpdateUserInput
  ) {
    return await this.userService.updateUser(user, input);
  }

  @Mutation(() => User)
  async deleteUser(@CurrentUser() user: User) {
    return await this.userService.deleteUser(user);
  }
}
