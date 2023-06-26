import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { MODALIDAD } from "../../interfaces/enums";
import { Matricula } from "./Matricula.entity";
import { Modulo } from "./Modulo.entity";

@Entity()
export class MatriculaModulosModulo extends BaseEntity {
    @PrimaryColumn()
    matriculaUuid: string;

    @PrimaryColumn()
    moduloUuid: string;

    @Column()
    fecha_inicio: Date;

    @Column()
    modalidad: MODALIDAD;

    @ManyToOne(
        () => Matricula,
        (matricula) => matricula.matriculaModulosMatricula
    )
    matricula: Matricula;

    @ManyToOne(() => Modulo, (modulo) => modulo.matriculaModulosMatricula)
    modulo: Modulo;
}
