import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Usuario } from "./Usuario.entity";

@Entity()
export class Rol extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid: number;

    @Column()
    nombre: string;

    @Column({ default: true, nullable: true, select: false })
    estado: boolean;

    @OneToMany(() => Usuario, (usuario) => usuario.rol)
    usuarios: Usuario[];

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;
}
