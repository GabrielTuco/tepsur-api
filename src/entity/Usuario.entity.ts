import { Column, Entity, ManyToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Rol } from "./Rol.entity";

@Entity()
export class Usuario extends EntityBase {
    @Column()
    usuario: string;

    @Column()
    password: string;

    @ManyToOne(() => Rol, (rol) => rol.usuarios)
    rol: Rol;
}
