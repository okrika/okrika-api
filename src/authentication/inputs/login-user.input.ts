import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginUserInput {
  @Field()
  identifier: string;

  @Field()
  password: string;
}
