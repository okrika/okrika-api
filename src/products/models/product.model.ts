import { Field, ObjectType } from "@nestjs/graphql";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Currency } from "src/shared/interfaces/shared.interface";
import { Document } from "src/shared/models/document.model";
import { User } from "src/users/models/user.model";
import { ProductCategory } from "../interfaces/product.interface";

@ObjectType()
@Schema({ timestamps: true, versionKey: false })
export class Product extends Document {
  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field()
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Field(() => ProductCategory)
  @Prop({
    required: true,
    enum: ProductCategory,
    default: ProductCategory.Others
  })
  category: ProductCategory;

  @Field(() => [String])
  @Prop({ type: [String], required: true, default: [] })
  images: string[];

  @Field(() => Number)
  @Prop({ type: Number, required: true })
  price: number;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: false })
  priceMax?: number;

  @Field(() => Currency)
  @Prop({ enum: Currency, required: true, default: Currency.RWF })
  currency: Currency;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  vendor: User;

  @Field(() => Number, { nullable: true })
  likeCount?: number;

  @Field(() => Boolean, { nullable: true })
  isLiked?: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export const ProductModel: ModelDefinition = {
  name: Product.name,
  schema: ProductSchema
};

export type ProductRepository = Model<Product>;
