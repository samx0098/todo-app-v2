import { Injectable } from '@nestjs/common';
import { SignJWT, jwtVerify } from 'jose';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
// import * as dotenv from 'dotenv';

// dotenv.config();

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET;

  // + Generate a JWT for a given user
  async generateToken(user: User): Promise<string> {
    const iat = new Date()
    const exp = new Date(iat.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days
    const jti = uuidv4();

    const rawToken = new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .setIssuer('https://example.com')
      .setAudience(user.id.toString())
      .setNotBefore(iat)
      .setSubject('todo-app')
      .setJti(jti)
      .sign(new TextEncoder().encode(this.jwtSecret))
      .then(() => {
        // todo: save token to authJTI entity
      })
      ;

    return 'Bearer ' + (await rawToken);
  }

  // + Verify a JWT and return the decoded payload
  async verifyToken(token: string): Promise<any> {
    //todo: extract jti from token and check if it exists in authJTI entity
    try {
      const { payload, } = await jwtVerify(
        token,
        new TextEncoder().encode(this.jwtSecret),
      );
      return payload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // + Invalidate a JWT
  async invalidateToken(token: string): Promise<void> {}
}
