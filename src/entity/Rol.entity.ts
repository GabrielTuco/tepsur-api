import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Usuario } from "./Usuario.entity";

@Entity()
export class Rol extends EntityBase {
    @Column()
    nombre: string;

    @OneToMany(() => Usuario, (usuario) => usuario.rol)
    usuarios: Usuario[];
}
