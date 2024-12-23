import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import * as bcrypt from "bcrypt"
import { Repository } from "typeorm"
import { User } from "./user.entity"

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOneBy({ email: email })
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}
