import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional } from "class-validator";
import { SocialLoginType } from "../interfaces/authentication.interface";

@InputType()
export class SocialLoginInput {
  @Field(() => SocialLoginType)
  @IsEnum(SocialLoginType, {
    message: "Please provide a valid social login type"
  })
  type: SocialLoginType;

  @Field({ nullable: true })
  @IsOptional()
  token?: string;
}
