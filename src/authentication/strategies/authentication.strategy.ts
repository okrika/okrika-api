import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User, UserRepository } from "../../users/models/user.model";
import { config } from "../../config";
import { User_Notfound_Message } from "../messages/authentication.message";
import { Types } from "mongoose";
import { isMongoId } from "class-validator";

@Injectable()
export class AuthenticationStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userRepository: UserRepository
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.tokenization.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: any) {
    try {
      if (!payload.id || !isMongoId(payload.id)) {
        throw new NotFoundException(User_Notfound_Message);
      }

      const user = await this.userRepository.findOne({
        isDeleted: false,
        _id: new Types.ObjectId(payload.id)
      });

      if (!user) {
        throw new NotFoundException(User_Notfound_Message);
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
