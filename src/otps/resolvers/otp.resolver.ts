import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { OtpService } from "../services/otp.service";
import { AuthResponse } from "src/authentication/responses/authentication.response";

@Resolver()
export class OtpResolver {
  constructor(private readonly otpService: OtpService) {}

  @Query(() => AuthResponse)
  async generateOtp(
    @Args({ name: "identifier", type: () => String, nullable: false })
    identifier: string,
    @Context() context: any
  ) {
    return await this.otpService.generateOtp(identifier, context);
  }

  @Mutation(() => String)
  async verifyOtp(
    @Args({ name: "code", type: () => String, nullable: false }) code: string
  ) {
    return await this.otpService.verifyOtp(code);
  }
}
