import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { EntityBase } from "../../entity";
import { Horario } from "./Horario.entity";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { MatriculaModulosModulo } from "./MatriculaModulosModulo.entity";

@Entity()
export class Modulo extends EntityBase {
    @Column({ unique: true })
    nombre: string;

    @Column()
    duracion_semanas: string;

    @ManyToMany(() => Horario, { nullable: true })
    @JoinTable()
    horarios: Horario[];

    @ManyToOne(() => Docente, (docente) => docente.modulos, { nullable: true })
    docente: Docente;

    @OneToMany(
        () => MatriculaModulosModulo,
        (matriculaModulosMatricula) => matriculaModulosMatricula.modulo
    )
    matriculaModulosMatricula: MatriculaModulosModulo[];
}
