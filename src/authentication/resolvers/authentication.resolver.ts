import { Args, Context, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthenticationService } from "../services/authentication.service";
import { User } from "src/users/models/user.model";
import { CreateUserInput } from "../inputs/create-user.input";
import { LoginResponse } from "../responses/login.response";
import { LoginUserInput } from "../inputs/login-user.input";
import { AuthResponse } from "../responses/authentication.response";
import { ForgotPasswordInput } from "../inputs/forgot-password.input";
import { ResetPasswordInput } from "../inputs/reset-password.input";
import { UseGuards } from "@nestjs/common";
import { Guard } from "../guards/authentication.guard";
import { ChangePasswordInput } from "../inputs/change-password.input";
import { CurrentUser } from "../decorators/current-user.decorator";
import { Types } from "mongoose";
import { SocialLoginInput } from "../inputs/social-login.input";

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation(() => LoginResponse)
  async createUser(
    @Args({ name: "input", type: () => CreateUserInput })
    input: CreateUserInput
  ) {
    return await this.authenticationService.createUser(input);
  }

  @Mutation(() => LoginResponse)
  async loginUser(
    @Args({ name: "input", type: () => LoginUserInput })
    input: LoginUserInput
  ) {
    return await this.authenticationService.loginUser(input);
  }

  @Mutation(() => AuthResponse)
  async forgotPassword(
    @Args({ name: "input", type: () => ForgotPasswordInput })
    input: ForgotPasswordInput,
    @Context() context: any
  ) {
    return await this.authenticationService.forgotPassword(input, context);
  }

  @Mutation(() => AuthResponse)
  async resetPassword(
    @Args({ name: "input", type: () => ResetPasswordInput })
    input: ResetPasswordInput
  ) {
    return await this.authenticationService.resetPassword(input);
  }

  @UseGuards(Guard)
  @Mutation(() => AuthResponse)
  async changePassword(
    @Args({ name: "input", type: () => ChangePasswordInput })
    input: ChangePasswordInput,
    @CurrentUser() user: User
  ) {
    return await this.authenticationService.changePassword(
      input,
      user._id as Types.ObjectId
    );
  }

  @Mutation(() => LoginResponse)
  async createUserBySocialMedia(
    @Args({ name: "input", type: () => SocialLoginInput })
    input: SocialLoginInput
  ) {
    return await this.authenticationService.createUserBySocialMedia(input);
  }

  @Mutation(() => LoginResponse)
  async loginUserBySocialMedia(
    @Args({ name: "input", type: () => SocialLoginInput })
    input: SocialLoginInput
  ) {
    return await this.authenticationService.loginUserBySocialMedia(input);
  }

  @UseGuards(Guard)
  @Query(() => AuthResponse)
  async checkUsername(
    @CurrentUser() user: User,
    @Args({ name: "username", type: () => String, nullable: true })
    username: string
  ) {
    return await this.authenticationService.checkUsername(username, user);
  }
}
