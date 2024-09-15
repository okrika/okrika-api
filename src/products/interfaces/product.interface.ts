import { registerEnumType } from "@nestjs/graphql";

export enum ProductCategory {
  Gadgets = "Gadgets",
  Clothing = "Clothing",
  Accessories = "Accessories",
  Fashion = "Fashion",
  HomeAppliances = "HomeAppliances",
  Furniture = "Furniture",
  Others = "Others"
}

registerEnumType(ProductCategory, {
  name: "ProductCategory",
  description: "Product Categories"
});
