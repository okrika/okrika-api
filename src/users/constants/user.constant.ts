import { UserType } from "../interfaces/user.interface";

export const optimizedUserFields = [
  "id",
  "firstName",
  "lastName",
  "username",
  "avatar"
];

export const AdminTypes = [UserType.SuperAdmin, UserType.Admin];

export const isAdmin = (type: UserType) => {
  return AdminTypes.includes(type);
};
