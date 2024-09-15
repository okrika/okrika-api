import { Document } from "../../shared/models/document.model";
import { User } from "../../users/models/user.model";
import { Field, ObjectType } from "@nestjs/graphql";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  NotificationStatus,
  NotificationType
} from "../interfaces/notification.interface";
import { Product } from "src/products/models/product.model";

@ObjectType()
@Schema({ timestamps: true, versionKey: false })
export class Notification extends Document {
  @Field({ nullable: true })
  @Prop({ required: false })
  title?: string;

  @Field()
  @Prop({ required: true })
  content: string;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  receiver: User;

  @Field(() => User, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  sender?: User;

  @Field({ nullable: true })
  @Prop({ required: false })
  link?: string;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: false })
  isRead: boolean;

  @Field({ nullable: true })
  @Prop({ required: false })
  icon?: string;

  @Field(() => NotificationType)
  @Prop({ enum: NotificationType, required: true })
  type: NotificationType;

  @Field(() => NotificationStatus)
  @Prop({ enum: NotificationStatus, required: true })
  status: NotificationStatus;

  @Field(() => Product, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Product.name, required: false })
  product?: Product;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

export const NotificationModel: ModelDefinition = {
  name: Notification.name,
  schema: NotificationSchema
};

NotificationSchema.statics.findByUser = async function (
  receiver: Types.ObjectId
) {
  return await this.find({ receiver });
};

export interface NotficicationRepository extends Model<Notification> {
  findByUser(user: Types.ObjectId): Promise<Notification[]>;
}
