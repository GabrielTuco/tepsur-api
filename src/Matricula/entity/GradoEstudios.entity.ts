import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "../../entity";
import { Alumno } from "../../Student/entity/Alumno.entity";

@Entity()
export class GradoEstudios extends EntityBase {
    @Column()
    uuid: string;

    @Column()
    descripcion: string;

    @OneToMany(() => Alumno, (alumno) => alumno.grado_estudios)
    alumnos: Alumno[];
}
