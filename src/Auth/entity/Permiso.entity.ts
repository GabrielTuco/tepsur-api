import { Column, Entity } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";

@Entity()
export class Permiso extends EntityBase {
    @Column()
    nombre: string;

    @Column({ default: true, nullable: true })
    estado: boolean;
}
