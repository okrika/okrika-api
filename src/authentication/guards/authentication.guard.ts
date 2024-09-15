import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import {
  Empty_Token_Error_Message,
  JWT_Token_Expired_Message
} from "../messages/authentication.message";

@Injectable()
export class Guard extends AuthGuard("jwt") {
  canActivate(
    reqContext: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlExecutionContext = GqlExecutionContext.create(reqContext);
    const context = gqlExecutionContext.getContext();
    const request = context?.req ?? reqContext.switchToHttp().getRequest();
    return super.canActivate(new ExecutionContextHost([request]));
  }

  handleRequest(err: any, user: any, info: any): any {
    if (err || !user) {
      if (info?.message?.includes("jwt expired")) {
        throw new UnauthorizedException(JWT_Token_Expired_Message);
      }
      throw new UnauthorizedException(Empty_Token_Error_Message);
    }

    return user;
  }
}
