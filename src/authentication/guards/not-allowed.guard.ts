import { GqlExecutionContext } from "@nestjs/graphql";
import { Guard } from "../guards/authentication.guard";
import { ExecutionContext, mixin } from "@nestjs/common";
import { UserType } from "../../users/interfaces/user.interface";

export const NotAllowed = (userTypes: UserType[]): any => {
  return mixin(
    class ScopesAuth extends Guard {
      async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!userTypes?.length) {
          return true;
        }

        const ctx = GqlExecutionContext.create(context);

        const GqlContext = ctx.getContext();

        const type = GqlContext?.req?.user?.type;

        return !userTypes.includes(type);
      }
    }
  );
};
