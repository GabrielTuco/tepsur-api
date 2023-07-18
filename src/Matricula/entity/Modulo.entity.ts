import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EntityBase } from "../../entity";
import { Grupo } from "./Grupo.entity";
import { MatriculaModulosModulo } from "./MatriculaModulosModulo";
import { Carrera } from "./Carrera.entity";

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

    @ManyToOne(() => Carrera, (carrera) => carrera.modulos)
    carrera: Carrera;

    @OneToMany(
        () => MatriculaModulosModulo,
        (matriculaModulosModulo) => matriculaModulosModulo.matricula
    )
    matriculaModulosModulo: MatriculaModulosModulo[];
}
