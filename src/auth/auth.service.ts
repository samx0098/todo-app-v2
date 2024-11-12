import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { SignJWT, jwtVerify } from "jose"
import { User } from "src/user/user.entity"
import { UserService } from "src/user/user.service"
import { Repository, UpdateResult } from "typeorm"
import { v4 as uuidv4 } from "uuid"
import { Auth } from "./auth.entity"

@Injectable()
export class AuthService {
    private readonly jwtSecret = process.env.JWT_SECRET
    // private readonly logger = new Logger(AuthService.name)

    constructor(
        @InjectRepository(Auth)
        private readonly authRepository: Repository<Auth>,
        private readonly userService: UserService,
    ) {}

    // + generate a JWT for a given user
    async generateToken(user: User): Promise<string> {
        const iat = new Date()
        const exp = new Date(iat.getTime() + 1000 * 60 * 60 * 24 * 7) // 7 days
        const jti = uuidv4()

        const rawToken = new SignJWT({ id: user.id, email: user.email })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt(iat)
            .setExpirationTime(exp)
            .setIssuer("https://example.com")
            .setAudience(user.id.toString())
            .setNotBefore(iat)
            .setSubject("todo-app")
            .setJti(jti)
            .sign(new TextEncoder().encode(this.jwtSecret))

        await this.createAuthEntry(user.id, jti, iat, exp)
        return "Bearer " + (await rawToken)
    }

    // + create an Auth entry in the table
    async createAuthEntry(
        userID: number,
        JTI: string,
        createdAt: Date,
        expirationTime: Date,
    ): Promise<Auth> {
        const newAuth = this.authRepository.create({
            userID,
            JTI,
            createdAt,
            expirationTime,
        })
        return await this.authRepository.save(newAuth)
    }

    // + verify a JWT and return the decoded payload
    async verifyToken(token: string): Promise<any> {
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(this.jwtSecret))
            const auth = await this.authRepository.findOneByOrFail({
                JTI: payload.jti,
            })
            if (!auth.revokedAt) return payload
            else throw new Error("Token has been revoked")
        } catch (error) {
            throw new Error("Invalid or expired token")
        }
    }

    // + invalidate a JWT
    async invalidateToken(token: string): Promise<null> {
        try {
            const payload = await this.verifyToken(token)
            const auth = await this.authRepository.findOneByOrFail({
                JTI: payload.jti,
            })
            await this.authRepository.update(auth.id, { revokedAt: new Date() })
            return Promise.resolve(null)
        } catch (error) {
            return Promise.reject("Something went wrong")
        }
    }

    // + login a user
    async login(email: string, password: string): Promise<{ token: string }> {
        try {
            const user =
                (await this.userService.findByEmail(email)) ||
                (await this.userService.findByUsername(email))
            if (!user || !(await this.userService.comparePassword(password, user.password)))
                throw new Error("Invalid email or password")
            return { token: await this.generateToken(user) }
        } catch (error) {
            return Promise.reject(error)
        }
    }
}
