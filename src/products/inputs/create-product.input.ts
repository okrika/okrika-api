import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsEnum, IsNumber, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { Currency } from "src/shared/interfaces/shared.interface";
import { FileInput } from "src/shared/services/media/inputs/file.input";
import { ProductCategory } from "../interfaces/product.interface";

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [FileInput])
  @IsArray({ message: "Please provide a valid images array" })
  images: FileInput[];

  @Field(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: "Please provide a valid price" }
  )
  price: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: "Please provide a valid maximum price" }
  )
  priceMax?: number;

  @Field(() => Currency, { nullable: true })
  @IsOptional()
  @IsEnum(Currency, { message: "Please provide a valid currency" })
  currency?: Currency;

  @Field(() => ProductCategory, { nullable: true })
  @IsOptional()
  @IsEnum(ProductCategory, {
    message: "Please provide a valid product category"
  })
  category?: ProductCategory;

  vendor: Types.ObjectId;

  code: string;
}
