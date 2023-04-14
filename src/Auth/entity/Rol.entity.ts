import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Usuario } from "./Usuario.entity";
import { Permiso } from "./Permiso.entity";

@Entity()
export class Rol extends EntityBase {
    @Column()
    nombre: string;

    @Column({ default: true, nullable: true, select: false })
    estado: boolean;

    @OneToMany(() => Usuario, (usuario) => usuario.rol)
    usuarios: Usuario[];

    @ManyToMany(() => Permiso)
    @JoinTable()
    permisos: Permiso[];
}
