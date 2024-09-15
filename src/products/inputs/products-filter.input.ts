import { Field, InputType } from "@nestjs/graphql";
import { FilterInput } from "src/shared/services/pagination/inputs/filter.input";
import { ProductCategory } from "../interfaces/product.interface";
import { IsArray } from "class-validator";

@InputType()
export class ProductsFilterInput extends FilterInput {
  @Field(() => [ProductCategory], { defaultValue: [] })
  @IsArray({ message: "Please provide a valid product category array" })
  categories: ProductCategory[];
}
