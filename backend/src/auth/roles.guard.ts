import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

export class RolesGuard implements CanActivate{
  constructor(private allowedRoles: string[]) {}
    canActivate(context: ExecutionContext): boolean {
        
        const request=context.switchToHttp().getRequest();
        const user=request.user;
        if(!user){
            throw new ForbiddenException();
        }
        if(!this.allowedRoles.includes(user.role)){
            throw new ForbiddenException('You do not have the authority');
        }
        return true;
    }

}