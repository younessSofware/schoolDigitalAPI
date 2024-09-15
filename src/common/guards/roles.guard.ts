import { CanActivate, ExecutionContext, mixin, Type, UnauthorizedException } from "@nestjs/common";
import { AccountRole } from "../enum/account-role.enum";

export const RolesGuard = (role: AccountRole): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    async canActivate(context: ExecutionContext) {

      const user = context.switchToHttp().getRequest().user;

      if (!user) {
        throw new UnauthorizedException("errors.authenticated_not_found")
      }

      return user.role == AccountRole.ADMIN || user.role == role;
    }
  }

  return mixin(RoleGuardMixin);
}