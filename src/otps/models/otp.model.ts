import { Document } from "../../shared/models/document.model";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Otp extends Document {
  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ type: Date, default: new Date(), expires: 600 })
  expireAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 600 });

export const OtpModel: ModelDefinition = { name: Otp.name, schema: OtpSchema };

export type OtpRepository = Model<Otp>;
