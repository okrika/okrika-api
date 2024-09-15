import {
  NotificationStatus,
  NotificationType
} from "../../notifications/interfaces/notification.interface";
import { NotificationService } from "../../notifications/services/notification.service";
import { FilterInput } from "../../shared/services/pagination/inputs/filter.input";
import { PaginationResult } from "../../shared/services/pagination/interfaces/pagination.interface";
import { optimizedUserFields } from "../../users/constants/user.constant";
import { User } from "../../users/models/user.model";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Types } from "mongoose";
import { LikeType } from "../interfaces/like.interface";
import { Like, LikeRepository } from "../models/like.model";
import { Product, ProductRepository } from "src/products/models/product.model";
import { inTransaction } from "src/utilities/transaction";

@Injectable()
export class LikeService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectModel(Product.name)
    private readonly productRepository: ProductRepository,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Like.name) private readonly likeRepository: LikeRepository
  ) {}

  async getLikeCount(type: LikeType, id: Types.ObjectId) {
    try {
      return await this.likeRepository.count({ [type]: id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async isLiked(type: LikeType, id: Types.ObjectId, user: Types.ObjectId) {
    try {
      return Boolean(await this.likeRepository.exists({ [type]: id, user }));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getLikes(
    type: LikeType,
    id: Types.ObjectId,
    filter?: FilterInput
  ): Promise<PaginationResult<Partial<User>>> {
    try {
      const paginate = new FilterInput(filter.take, filter.page);

      const likes = await this.likeRepository
        .find({ [type]: id }, "user", {
          limit: paginate.take,
          skip: (paginate.page - 1) * paginate.take
        })
        .populate({ path: "user", select: optimizedUserFields });

      const totalCount = await this.getLikeCount(type, id);

      const totalPages = Math.ceil(totalCount / paginate.take);

      return {
        totalCount,
        totalPages,
        list: likes.map(({ user }) => user)
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async likeOrUnlikeProduct(product: Types.ObjectId, user: User) {
    return await inTransaction(this.connection, async session => {
      try {
        const productResponse = await this.productRepository.findOne(
          {
            _id: product,
            isDeleted: false
          },
          "",
          { populate: ["vendor"] }
        );

        if (!productResponse) {
          throw new NotFoundException(
            "This Product might have been deleted or does not exist"
          );
        }

        const existingLike = await this.likeRepository.findOne({
          product,
          user: user._id
        });

        if (existingLike) {
          await existingLike.remove({ session });
        } else {
          const newLike = await this.likeRepository.create({
            product,
            user: user._id
          });

          await newLike.save({ session });

          const existingNotification =
            await this.notificationService.findNotification({
              sender: user._id,
              type: NotificationType.Like,
              product: productResponse._id,
              receiver: productResponse.vendor._id
            });

          if (!existingNotification && user.id !== productResponse.vendor.id) {
            await this.notificationService.createNotification(
              {
                sender: user._id,
                type: NotificationType.Like,
                product: productResponse._id,
                status: NotificationStatus.Info,
                receiver: productResponse.vendor._id,
                content: `${user.firstName} just liked your product!`
              },
              session
            );
          }
        }

        await session.commitTransaction();

        productResponse.isLiked = !existingLike;

        return productResponse;
      } catch (error) {
        await session.abortTransaction();

        throw new InternalServerErrorException(error);
      }
    });
  }
}
