import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ForgotPasswordInput {
  @Field()
  identifier: string;
}
