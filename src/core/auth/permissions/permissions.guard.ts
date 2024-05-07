import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsEnum } from './permissions.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<PermissionsEnum[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true; // No permissions required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming you have a user object in the request
    console.log(user);

    if (
      !user ||
      !user.permissions ||
      !user.permissions.some((permission) => permissions.includes(permission))
    ) {
      return false; // User doesn't have required permissions
    }

    return true; // User has required permissions
  }
}
