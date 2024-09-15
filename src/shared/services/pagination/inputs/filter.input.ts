import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class FilterInput {
  constructor(take?: number, page?: number) {
    this.take = take ? (take >= 100 ? 100 : take) : 20;
    this.page = page ? (page <= 0 ? 1 : page) : 1;
  }

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  take?: number;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field({ nullable: true })
  keyword?: string;
}
