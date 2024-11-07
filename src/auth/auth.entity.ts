import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 36, unique: true })
    JTI: string

    @Column()
    userID: number

    @CreateDateColumn()
    createdAt: Date

    @Column()
    expirationTime: Date

    @Column({ nullable: true })
    revokedAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
