import { Args, Query, Resolver } from "@nestjs/graphql";
import { ProductService } from "../services/product.service";
import { ProductsResponse } from "../responses/products.response";
import { ProductsFilterInput } from "../inputs/products-filter.input";
import { Product } from "../models/product.model";

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductsResponse)
  async getProducts(
    @Args({ name: "filter", type: () => ProductsFilterInput, nullable: false })
    filter: ProductsFilterInput
    // @CurrentToken() token: string
  ) {
    return await this.productService.getProducts(filter);
  }

  @Query(() => Product)
  async getProduct(
    @Args({ name: "id", type: () => String, nullable: false }) id: string
    // @CurrentToken() token: string
  ) {
    return await this.productService.getProduct(id);
  }
}
