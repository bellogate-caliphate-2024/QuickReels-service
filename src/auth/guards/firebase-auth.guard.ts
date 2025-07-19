import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No Firebase ID token provided');
    }
    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      request['user'] = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
} 