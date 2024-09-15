import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
  constructor(success?: boolean, message?: string) {
    this.success = success;

    if (message) {
      this.message = message;
    }
  }

  @Field(() => Boolean)
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
