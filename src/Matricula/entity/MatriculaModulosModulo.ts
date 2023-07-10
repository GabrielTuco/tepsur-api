import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { EntityBase } from "../../entity";
import { ESTADO_MODULO_MATRICULA, MODALIDAD } from "../../interfaces/enums";
import { Matricula } from "./Matricula.entity";
import { Modulo } from "./Modulo.entity";

@Entity()
export class MatriculaModulosModulo extends EntityBase {
    @PrimaryColumn()
    matriculaUuid: string;

    @PrimaryColumn()
    moduloUuid: string;

    @Column()
    estado: ESTADO_MODULO_MATRICULA;

    @Column()
    fecha_inicio: Date;

    @Column()
    modalidad: MODALIDAD;

    @ManyToMany(
        () => Matricula,
        (matricula) => matricula.matriculaModulosModulo
    )
    matricula: Matricula;

    @ManyToOne(() => Modulo, (modulo) => modulo.matriculaModulosModulo)
    modulo: Modulo;
}
