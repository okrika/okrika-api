import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationResponse } from "src/shared/services/pagination/responses/pagination.response";
import { Product } from "../models/product.model";

@ObjectType()
export class ProductsResponse extends PaginationResponse<Product> {
  @Field(() => [Product])
  list: Product[];
}
