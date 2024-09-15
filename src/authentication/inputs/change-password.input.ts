import { Field, InputType } from "@nestjs/graphql";
import { MinLength } from "class-validator";

@InputType()
export class ChangePasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  @MinLength(8, {
    message: "Please ensure that your password is at least 8 characters long"
  })
  newPassword: string;
}
