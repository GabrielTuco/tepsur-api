import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Usuario } from "./Usuario.entity";

@Entity()
export class Permiso extends EntityBase {
    @Column()
    nombre: string;

    @Column({ default: true, nullable: true })
    estado: boolean;
}
