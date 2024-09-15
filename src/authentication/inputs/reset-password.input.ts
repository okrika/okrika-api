import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ResetPasswordInput {
  @Field()
  code: string;

  @Field()
  password: string;
}
