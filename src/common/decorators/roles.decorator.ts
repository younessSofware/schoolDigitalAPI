import { SetMetadata } from '@nestjs/common';
import { AccountRole } from '../enum/account-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles);