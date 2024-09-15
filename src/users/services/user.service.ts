import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { UpdateUserInput } from "../inputs/update-user.input";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserRepository } from "../models/user.model";
import { PaginationQuery } from "src/shared/services/pagination/interfaces/pagination.interface";
import { UsersFilterInput } from "../inputs/users-filter.input";
import { PaginationService } from "src/shared/services/pagination/services/pagination.service";
import { MediaService } from "src/shared/services/media/services/media.service";
import { omit } from "lodash";
import { EncryptionService } from "src/shared/services/encryption/services/encryption.service";

const keywords = ["firstName", "lastName", "username", "email", "phoneNumber"];

@Injectable()
export class UserService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly paginationService: PaginationService,
    private readonly encryptionService: EncryptionService,
    @InjectModel(User.name) private readonly userRepository: UserRepository
  ) {}

  async getUsers(filter: UsersFilterInput) {
    try {
      const { take = 10, page = 1, keyword = "", type } = filter;

      const query: PaginationQuery<User> = {
        page,
        take,
        isDeleted: false,
        sort: { createdAt: -1 }
      };

      if (type || keyword) {
        query.$or = [];

        if (type) {
          query.$or.push([{ type }]);
        }

        if (keyword) {
          query.$or.push(
            ...keywords.map(key => ({
              [key]: { $regex: new RegExp(keyword.split(" ").join("|"), "i") }
            }))
          );
        }
      }

      return await this.paginationService.paginate(this.userRepository, query);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUser(user: User, username?: string) {
    try {
      let profile: User;

      if (username) {
        profile = await this.userRepository.findOne({
          username,
          isDeleted: false
        });
      } else {
        profile = user;
      }

      if (!profile) {
        throw new NotFoundException(
          `User with Username: (${username}) either does not exist or has been deleted.`
        );
      }

      return profile;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserByToken(token: string) {
    try {
      const payload = await this.encryptionService.verify(
        token.split("Bearer ")[1]
      );

      return await this.userRepository.findById(payload?.id || "");
    } catch (error) {
      return null;
    }
  }

  async updateUser(user: User, input: UpdateUserInput) {
    try {
      Object.entries(omit(input, ["avatarInput"])).forEach(([key, value]) => {
        if (key in user) {
          if (key === "avatar" && !!value) {
            return;
          }

          user[key] = value;
        }
      });

      if (input.shouldRemoveAvatar && user.avatar) {
        await this.mediaService.deleteFile(`users/${user.id}/avatar`);
      }

      if (input.avatarInput) {
        const response = await this.mediaService.uploadFile(
          Buffer.from(input.avatarInput.uri, "base64"),
          {
            resource_type: "image",
            public_id: `users/${user.id}/avatar`
          }
        );

        user.avatar = response.secure_url;
      }

      return await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUser(user: User) {
    try {
      user.isDeleted = true;

      await this.mediaService.deleteByFolder(`users/${user.id}`);

      return await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
