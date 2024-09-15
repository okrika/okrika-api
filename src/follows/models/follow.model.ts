import { Document } from "../../shared/models/document.model";
import { User } from "../../users/models/user.model";
import { ConflictException, Logger } from "@nestjs/common";
import { Field, ObjectType } from "@nestjs/graphql";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@ObjectType()
@Schema({ timestamps: true, versionKey: false })
export class Follow extends Document {
  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  follower: User;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  followee: User;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

FollowSchema.index({ followee: 1, follower: 1 }, { unique: true });

FollowSchema.post("save", async function (error, follow, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    new Logger().error("Duplicate follow!");
    next(new ConflictException("Duplicate Follow!"));
  } else {
    next();
  }
});

export const FollowModel: ModelDefinition = {
  name: Follow.name,
  schema: FollowSchema
};

export type FollowRepository = Model<Follow>;
