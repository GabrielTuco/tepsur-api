import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { EntityBase } from "../../entity";
import { Matricula } from "./Matricula.entity";

@Entity()
export class Modulo extends EntityBase {
    @Column({ unique: true })
    nombre: string;

    @Column()
    duracion_semanas: string;

    @OneToMany(() => Matricula, (matricula) => matricula.modulo)
    matriculas: Matricula[];
}
