import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "../../entity";
import { Grupo } from "./Grupo.entity";
import { DIAS } from "../../interfaces/enums";
import { Matricula } from "./Matricula.entity";
import { MatriculaModulosModulo } from "./MatriculaModulosModulo";

@Entity()
export class Horario extends EntityBase {
    @Column("text", { array: true })
    dias: DIAS[]; //['Lun','Mar','Mie']

    @Column()
    hora_inicio: string; // hh:mm en formato de 24 horas

    @Column()
    hora_fin: string; // hh:mm en formato de 24 horas

    @Column({ default: true })
    estado: boolean;

    @OneToMany(() => Grupo, (grupo) => grupo.horario)
    grupos: Grupo[];

    @OneToMany(() => Matricula, (matricula) => matricula.horario)
    matriculas: Matricula[];

    @OneToMany(
        () => MatriculaModulosModulo,
        (matriculaModulo) => matriculaModulo.horario
    )
    matricula_modulos: MatriculaModulosModulo[];
}
