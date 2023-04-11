import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Usuario } from "./Usuario.entity";

@Entity()
export class Rol extends EntityBase {
    @Column()
    nombre: string;

    @Column({ default: true, nullable: true })
    estado: boolean;

    @OneToMany(() => Usuario, (usuario) => usuario.rol)
    usuarios: Usuario[];
}
