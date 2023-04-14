import { Column, Entity, ManyToOne } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Rol } from "./Rol.entity";

@Entity()
export class Usuario extends EntityBase {
    @Column({ unique: true })
    usuario: string;

    @Column()
    password: string;

    @Column({ default: false })
    securePasswordUpdated: boolean;

    @ManyToOne(() => Rol, (rol) => rol.usuarios)
    rol: Rol;
}
