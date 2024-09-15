import { registerEnumType } from "@nestjs/graphql";

export enum NotificationStatus {
  Info = "Info",
  Error = "Error",
  Warning = "Warning",
  Success = "Success"
}

export enum NotificationType {
  User = "User",
  Like = "Like",
  Review = "Review",
  System = "System",
  Follow = "Follow",
  Product = "Product",
  Authentication = "Authentication"
}

export interface SendNotificationInput {
  app_id?: string;

  channel_for_external_user_ids?: string;

  app_url?: string;

  headings?: {
    [x: string]: string;
  };

  heading?: string;

  contents?: {
    [x: string]: string;
  };

  content?: string;

  include_external_user_ids?: string[];

  recipients: string[];
}

registerEnumType(NotificationStatus, {
  name: "NotificationStatus",
  description: "Notification Status Types"
});

registerEnumType(NotificationType, {
  name: "NotificationType",
  description: "Notification Types"
});
