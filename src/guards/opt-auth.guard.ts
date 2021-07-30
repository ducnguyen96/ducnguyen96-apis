import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { GraphQLContext } from 'src/graphql/interfaces/graphql.interface';
import { AuthenticationError } from 'apollo-server-express';

@Injectable()
export class OptAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    const accessToken = ExtractJwt.fromAuthHeaderWithScheme('Bearer')(ctx.req);
    if (!accessToken) return true;
    return super.canActivate(context);
  }
  getRequest(context: ExecutionContext) {
    const ctx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    if (!ctx) {
      throw new AuthenticationError('Unauthorized');
    }
    return ctx.req;
  }
}
