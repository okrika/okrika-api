import { Field, InputType, OmitType, PartialType } from "@nestjs/graphql";
import { CreateProductInput } from "./create-product.input";
import GraphQLObjectId from "graphql-type-object-id";
import { IsObjectId } from "src/shared/validators/objectid.validator";
import { Types } from "mongoose";

@InputType()
export class UpdateProductInput extends OmitType(
  PartialType(CreateProductInput),
  ["vendor", "code"]
) {
  @Field(() => GraphQLObjectId)
  @IsObjectId({ field: "product" })
  id: Types.ObjectId;
}
