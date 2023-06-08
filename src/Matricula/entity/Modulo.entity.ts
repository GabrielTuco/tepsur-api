import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { EntityBase } from "../../entity";

@Entity()
export class Modulo extends EntityBase {
    @Column({ unique: true })
    nombre: string;

    @Column()
    duracion_semanas: string;
}
