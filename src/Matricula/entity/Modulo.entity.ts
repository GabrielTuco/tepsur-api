import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "../../entity";
import { Grupo } from "./Grupo.entity";
import { MatriculaModulosModulo } from "./MatriculaModulosModulo";

@Entity()
export class Modulo extends EntityBase {
    @Column({ unique: true })
    nombre: string;

    @Column()
    duracion_semanas: string;

    @Column()
    orden: number;

    @OneToMany(() => Grupo, (grupo) => grupo.modulo)
    grupos: Grupo[];

    @OneToMany(
        () => MatriculaModulosModulo,
        (matriculaModulosModulo) => matriculaModulosModulo.matricula
    )
    matriculaModulosModulo: MatriculaModulosModulo[];
}
