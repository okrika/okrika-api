import { Document } from "../../shared/models/document.model";
import { User } from "../../users/models/user.model";
import { BadRequestException } from "@nestjs/common";
import { Field, ObjectType } from "@nestjs/graphql";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { LikeType } from "../interfaces/like.interface";
import { Product } from "src/products/models/product.model";

@ObjectType()
@Schema({ timestamps: true, versionKey: false })
export class Like extends Document {
  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Field(() => Product)
  @Prop({ type: Types.ObjectId, ref: Product.name, required: false })
  product?: Product;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.pre("save", async function (next) {
  if (!this.product) {
    next(new BadRequestException());
  } else {
    next();
  }
});

LikeSchema.statics.getLikeCount = async function (
  type: LikeType,
  id: Types.ObjectId
) {
  return new Promise((resolve, reject) => {
    this.count({ [type]: id }, (error, count) => {
      if (error) {
        reject(error);
      } else {
        resolve(count);
      }
    });
  });
};

LikeSchema.statics.isLiked = async function (
  type: LikeType,
  id: Types.ObjectId,
  user: Types.ObjectId
) {
  return Boolean(await this.exists({ [type]: id, user }));
};

export const LikeModel: ModelDefinition = {
  name: Like.name,
  schema: LikeSchema
};

export interface LikeRepository extends Model<Like> {
  getLikeCount(type: LikeType, id: Types.ObjectId): Promise<number>;

  isLiked(
    type: LikeType,
    id: Types.ObjectId,
    user: Types.ObjectId
  ): Promise<boolean>;
}
