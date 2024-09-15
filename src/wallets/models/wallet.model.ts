import {
  ConflictException,
  InternalServerErrorException
} from "@nestjs/common";
import { Field, ObjectType } from "@nestjs/graphql";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CountryCode } from "libphonenumber-js";
import { Model, Types } from "mongoose";
import {
  countryCodes,
  CountryCodeType
} from "src/shared/constants/shared.constant";
import { Document } from "src/shared/models/document.model";
import { User } from "src/users/models/user.model";
import { toFixed } from "src/utilities/to-fixed";

@ObjectType()
@Schema({ timestamps: true, versionKey: false })
export class Wallet extends Document {
  @Field({ nullable: true })
  @Prop({ required: false, trim: true })
  bankName?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  bankCode?: string;

  @Field({ nullable: true })
  @Prop({ required: false, trim: true })
  accountName?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  accountNumber?: string;

  @Field(() => CountryCodeType, { nullable: true })
  @Prop({ required: false, enum: countryCodes })
  mobileMoneyCode?: CountryCode;

  @Field({ nullable: true })
  @Prop({ required: false })
  mobileMoneyNumber?: string;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Field(() => Number)
  @Prop({ type: Number, required: true, default: 0 })
  received: number;

  @Field(() => Number)
  @Prop({ type: Number, required: true, default: 0 })
  spent: number;

  getBalance: () => number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.pre("save", async function (next) {
  if (this.isModified("mobileMoneyCode")) {
    if (!this.mobileMoneyNumber) {
      return next(
        new ConflictException("Please provide a Mobile Money Number")
      );
    }
  }

  if (this.isModified("mobileMoneyNumber")) {
    if (!this.mobileMoneyCode) {
      return next(
        new ConflictException(
          "Please provide a Country Code for this Mobile Money Number"
        )
      );
    }
  }

  next();
});

WalletSchema.statics.findByUser = async function (user: Types.ObjectId) {
  try {
    return await this.findOne({ user });
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
};

WalletSchema.methods.getBalance = function (this: Wallet) {
  if (!this) {
    return 0;
  }

  return toFixed(this.received - this.spent);
};

export const WalletModel: ModelDefinition = {
  name: Wallet.name,
  schema: WalletSchema
};

export interface WalletRepository extends Model<Wallet> {
  findByUser(user: Types.ObjectId): Promise<Wallet | null>;
}
