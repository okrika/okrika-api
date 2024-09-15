import { Field, InputType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";
import { FilterInput } from "../../shared/services/pagination/inputs/filter.input";
import { UserType } from "../interfaces/user.interface";

@InputType()
export class UsersFilterInput extends FilterInput {
  @IsEnum(UserType)
  @Field(() => UserType, { nullable: true })
  type?: UserType;
}
