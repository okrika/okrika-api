import { config } from "../../config";
import { PaginationService } from "../../shared/services/pagination/services/pagination.service";
import { User } from "../../users/models/user.model";
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import axios from "axios";
import { ClientSession, Connection, FilterQuery, Types } from "mongoose";
import { CreateNotificationInput } from "../inputs/create-notification.input";
import { SendNotificationInput } from "../interfaces/notification.interface";
import {
  NotficicationRepository,
  Notification
} from "../models/notification.model";
import { PaginationQuery } from "../../shared/services/pagination/interfaces/pagination.interface";
import { AuthResponse } from "../../authentication/responses/authentication.response";
import { NotificationsResponse } from "../responses/notifications.response";
import { inTransaction } from "../../utilities/transaction";
import { FilterInput } from "../../shared/services/pagination/inputs/filter.input";
import { stringify } from "src/utilities/stringify-json";

const api = axios.create({
  withCredentials: true,
  baseURL: "https://onesignal.com/api/v1",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${config.notifications.apiKey}`
  }
});

@Injectable()
export class NotificationService {
  constructor(
    private readonly loggerService: Logger,
    private readonly paginationService: PaginationService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Notification.name)
    private readonly notificationRepository: NotficicationRepository
  ) {}

  private async sendNotification(input: SendNotificationInput) {
    try {
      input.headings = input.headings || {
        en: input.heading || "New Notification occurred"
      };

      input.contents = input.contents || {
        en: input.content || "You have a new notification"
      };

      input.app_id = config.notifications.appId;

      input.channel_for_external_user_ids = "push";

      input.include_external_user_ids = input.recipients;

      delete input.recipients;

      const response = await api.post("/notifications", input);

      if (response.data && response.data?.errors) {
        this.loggerService.error(stringify(response.data), "Notifications");
      }
    } catch (error) {
      this.loggerService.error(stringify(error), "Notifications");
    }
  }

  async getUserNotifications(
    filter: FilterInput,
    receiver: User
  ): Promise<NotificationsResponse> {
    try {
      const { take, page } = filter;

      const query: PaginationQuery<Notification> = {
        page,
        take,
        populate: ["listing"],
        receiver: receiver._id,
        sort: { createdAt: -1 }
      };

      const notificationsResponse = (await this.paginationService.paginate(
        this.notificationRepository,
        query
      )) as NotificationsResponse;

      notificationsResponse.unReadCount =
        await this.notificationRepository.count({
          isRead: false,
          receiver: receiver._id
        });

      return notificationsResponse;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findNotification(query: FilterQuery<Notification>) {
    try {
      return await this.notificationRepository.exists(query);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createNotification(
    input: CreateNotificationInput,
    session: ClientSession
  ) {
    try {
      const notification = await (
        await this.notificationRepository.create([input], { session })
      )[0].populate(["receiver"]);

      await this.sendNotification({
        content: notification.content,
        recipients: [notification.receiver.username],
        heading: notification.title || notification.content
      });

      return notification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async markNotificationAsRead(id: Types.ObjectId, receiver: User) {
    try {
      const notification = await this.notificationRepository.findOne(
        {
          _id: id,
          receiver: receiver._id
        },
        "isRead"
      );

      if (!notification) {
        throw new NotFoundException("This Notification does not exist");
      }

      if (!notification.isRead) {
        notification.isRead = true;

        await notification.save();
      }

      return new AuthResponse(true);
    } catch (error) {
      this.loggerService.error(
        stringify(error),
        "Notification",
        "Marking Notification as Read"
      );

      return new AuthResponse(false);
    }
  }

  async markAllAsRead(input: FilterInput, receiver: User) {
    return await inTransaction(this.connection, async session => {
      try {
        const notifications = await this.notificationRepository.find(
          { receiver: receiver._id, isRead: false },
          "isRead",
          {
            limit: input.take,
            skip: (input.page - 1) * input.take
          }
        );

        if (!notifications.length) {
          await session.commitTransaction();

          return new AuthResponse(true, "Successfully marked as read");
        }

        const updatedNotifications = notifications.map(notification => {
          notification.isRead = true;

          return notification;
        });

        const result = await this.notificationRepository.bulkSave(
          updatedNotifications,
          { session }
        );

        if (!result.isOk()) {
          throw new ConflictException(result.getWriteErrors());
        }

        await session.commitTransaction();

        return new AuthResponse(true, "Successfully marked as read");
      } catch (error) {
        await session.abortTransaction();
        throw new InternalServerErrorException(error);
      }
    });
  }
}
