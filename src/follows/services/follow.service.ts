import {
  NotificationStatus,
  NotificationType
} from "../../notifications/interfaces/notification.interface";
import { NotificationService } from "../../notifications/services/notification.service";
import { FilterInput } from "../../shared/services/pagination/inputs/filter.input";
import { optimizedUserFields } from "../../users/constants/user.constant";
import { User, UserRepository } from "../../users/models/user.model";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { ClientSession, Connection, Types } from "mongoose";
import { Follow, FollowRepository } from "../models/follow.model";
import { FollowsResponse } from "../responses/followers.response";
import { FollowsFilterInput } from "../inputs/followers-filter.input";
import { omit } from "lodash";
import { paginate } from "../../utilities/paginate";
import { inTransaction } from "src/utilities/transaction";

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: UserRepository,
    @InjectModel(Follow.name)
    private readonly followRepository: FollowRepository,
    private readonly notificationService: NotificationService,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async getFollowers(
    followee: Types.ObjectId,
    filter?: FollowsFilterInput
  ): Promise<FollowsResponse> {
    const pagination = new FilterInput(filter?.take, filter?.page);

    if (filter?.keyword) {
      const keywords = [
        "follower.firstName",
        "follower.lastName",
        "follower.username",
        "follower.email",
        "follower.phoneNumber"
      ];

      const keywordQuery = keywords.map(key => ({
        [key]: { $regex: new RegExp(filter.keyword.split(" ").join("|"), "i") }
      }));

      const follows = await this.followRepository.aggregate([
        { $match: { followee } },
        {
          $lookup: {
            from: "users",
            localField: "follower",
            foreignField: "_id",
            as: "follower"
          }
        },
        { $match: { $or: keywordQuery } }
      ]);

      const followers = follows.map(follow => {
        follow.follower = omit(follow?.follower?.[0], ["password"]);

        follow.follower.id = follow?.follower?._id?.toString();

        return follow?.follower;
      });

      return paginate(followers, pagination.page, pagination.take);
    }

    const followers = await this.followRepository
      .find({ followee }, "follower", {
        limit: pagination.take,
        skip: (pagination.page - 1) * pagination.take
      })
      .populate({
        path: "follower",
        select: optimizedUserFields
      });

    const totalCount = await this.getFollowerCount(followee);

    const totalPages = Math.ceil(totalCount / pagination.take);

    return {
      totalCount,
      totalPages,
      list: followers.map(({ follower }) => follower)
    };
  }

  async getFollowerCount(followee: Types.ObjectId) {
    try {
      return await this.followRepository.count({ followee });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getFollowing(
    follower: Types.ObjectId,
    filter?: FollowsFilterInput
  ): Promise<FollowsResponse> {
    const pagination = new FilterInput(filter?.take, filter?.page);

    if (filter?.keyword) {
      const keywords = [
        "followee.firstName",
        "followee.lastName",
        "followee.username",
        "followee.email",
        "followee.phoneNumber"
      ];

      const keywordQuery = keywords.map(key => ({
        [key]: { $regex: new RegExp(filter.keyword.split(" ").join("|"), "i") }
      }));

      const follows = await this.followRepository.aggregate([
        { $match: { follower } },
        {
          $lookup: {
            from: "users",
            localField: "followee",
            foreignField: "_id",
            as: "followee"
          }
        },
        { $match: { $or: keywordQuery } }
      ]);

      const following = follows.map(follow => {
        follow.followee = omit(follow?.followee?.[0], ["password"]);

        follow.followee.id = follow?.followee?._id?.toString();

        return follow?.followee;
      });

      return paginate(following, pagination.page, pagination.take);
    }

    const following = await this.followRepository
      .find({ follower }, "followee", {
        limit: pagination.take,
        skip: (pagination.page - 1) * pagination.take
      })
      .populate({
        path: "followee",
        select: optimizedUserFields
      });

    const totalCount = await this.getFollowingCount(follower);
    const totalPages = Math.ceil(totalCount / pagination.take);

    return {
      totalCount,
      totalPages,
      list: following.map(({ followee }) => followee)
    };
  }

  async getFollowingCount(follower: Types.ObjectId) {
    try {
      return await this.followRepository.count({ follower });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async isFollowing(follower: Types.ObjectId, followee: Types.ObjectId) {
    try {
      return Boolean(
        await this.followRepository.exists({ follower, followee })
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async followOrUnfollowUser(
    follower: User,
    followee: Types.ObjectId
  ): Promise<User> {
    return await inTransaction(this.connection, async session => {
      try {
        const user = await this.followOrUnfollow(follower, followee, session);

        await session.commitTransaction();

        return user;
      } catch (error) {
        await session.abortTransaction();

        throw new InternalServerErrorException(error);
      }
    });
  }

  async followOrUnfollow(
    follower: User,
    followee: Types.ObjectId,
    session: ClientSession
  ) {
    if (follower.id === followee.toString()) {
      throw new BadRequestException(
        "Please note that you cannot follow yourself"
      );
    }

    const user = await this.userRepository.findOne({
      _id: followee,
      isDeleted: false
    });

    if (!user) {
      throw new NotFoundException(
        "The person you are trying to follow or unfollow either doesn't exist or has had his/her account deleted."
      );
    }

    const existingFollow = await this.followRepository.findOne({
      followee,
      follower: follower._id
    });

    if (existingFollow) {
      await existingFollow.remove({ session });
    } else {
      const [newFollow] = await this.followRepository.create(
        [
          {
            followee,
            follower: follower._id
          }
        ],
        { session }
      );

      await newFollow.save({ session });

      const existingNotification =
        await this.notificationService.findNotification({
          receiver: followee,
          sender: follower._id,
          type: NotificationType.Follow
        });

      if (!existingNotification) {
        await this.notificationService.createNotification(
          {
            receiver: followee,
            sender: follower._id,
            type: NotificationType.Follow,
            status: NotificationStatus.Info,
            title: `${follower.firstName} followed you`,
            content: `${follower.firstName} is now following you, you can follow back`
          },
          session
        );
      }
    }

    user.followerCount = await this.getFollowerCount(user._id);

    user.followingCount = await this.getFollowingCount(user._id);

    user.isFollowing = !existingFollow;

    return user;
  }
}
