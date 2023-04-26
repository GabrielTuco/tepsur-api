import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Usuario } from "../Auth/entity/Usuario.entity";

@Entity()
export class Administrador extends EntityBase {
    @Column({ length: 8, unique: true })
    dni: string;

    @Column()
    nombres: string;

    @Column()
    ape_paterno: string;

    @Column()
    ape_materno: string;

    @Column({ nullable: true, length: 9 })
    celular: string;

    @Column({ nullable: true })
    correo: string;

    @Column({ default: false })
    securePasswordUpdated: boolean;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;
}