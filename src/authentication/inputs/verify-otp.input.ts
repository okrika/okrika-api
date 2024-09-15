import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class VerifyOtpInput {
  @Field()
  code: string;

  @Field()
  identifier: string;
}
