import { Field, InputType } from "@nestjs/graphql";
import { FilterInput } from "src/shared/services/pagination/inputs/filter.input";

@InputType()
export class FollowsFilterInput extends FilterInput {
  @Field({ nullable: true })
  keyword?: string;
}
