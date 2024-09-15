import { Field, ObjectType } from "@nestjs/graphql";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  ErrorHandlingMiddlewareFunction,
  Model,
  ProjectionType,
  Types
} from "mongoose";
import { Document } from "src/shared/models/document.model";
import { UserType } from "../interfaces/user.interface";
import {
  countryCodes,
  CountryCodeType,
  defaultCountry
} from "src/shared/constants/shared.constant";
import { CountryCode } from "libphonenumber-js";
import { EncryptionService } from "src/shared/services/encryption/services/encryption.service";
import { JwtService } from "@nestjs/jwt";

@ObjectType()
@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Field(() => CountryCodeType)
  @Prop({ required: true, enum: countryCodes, default: defaultCountry.iso })
  phoneCode: CountryCode;

  @Field({ nullable: true })
  @Prop({ required: false })
  phoneNumber?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  bio?: string;

  @Prop({ required: true, select: false })
  password: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  avatar?: string;

  @Field(() => User, { nullable: true })
  @Prop({ ref: User.name, type: Types.ObjectId, required: false })
  referredBy?: User;

  @Field(() => UserType)
  @Prop({ enum: UserType, default: UserType.User })
  type: UserType;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;

  @Field(() => Boolean, { nullable: true })
  isFollowing?: boolean;

  @Field(() => Number, { nullable: true })
  followerCount?: number;

  @Field(() => Number, { nullable: true })
  followingCount?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel: ModelDefinition = {
  name: User.name,
  schema: UserSchema
};

UserSchema.statics.findByIdentity = async function (
  identity: string,
  projection?: ProjectionType<User>
) {
  return await this.findOne(
    {
      $and: [
        {
          $or: [
            { email: identity },
            { username: identity },
            { phoneNumber: identity }
          ]
        },
        { isDeleted: false }
      ]
    },
    projection
  );
};

UserSchema.statics.existsByIdentity = async function (identity: string) {
  return await this.exists({
    $and: [
      {
        $or: [
          { email: identity },
          { username: identity },
          { phoneNumber: identity }
        ]
      },
      { isDeleted: false }
    ]
  });
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const password = await new EncryptionService(new JwtService()).hash(
      this.get("password")
    );

    this.set("password", password);
  }

  next();
});

//Checking for unique keys when you have multiple indexes
UserSchema.post("save", function (error, doc, next) {
  if (error?.name === "MongoServerError" && (error as any)?.code === 11000) {
    //   next(new ConflictException(UserName_Already_Exists_Message));
  } else {
    next();
  }
} as ErrorHandlingMiddlewareFunction<User>);

export interface UserRepository extends Model<User> {
  findByIdentity(
    identity: string,
    projection?: ProjectionType<User>
  ): Promise<User | null>;

  existsByIdentity(identity: string): Promise<{ _id: any } | null>;
}
