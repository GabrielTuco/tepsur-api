import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "../../entity";
import { MatriculaEspecializacion } from "./MatriculaEspecializacion.entity";

@Entity()
export class Especializacion extends EntityBase {
    @Column()
    nombre: string;

    @Column()
    duracion_semanas: number;

    @Column()
    precio: number;

    @Column({ default: true })
    estado: boolean;

    @OneToMany(
        () => MatriculaEspecializacion,
        (matriculaEspe) => matriculaEspe.especializacion
    )
    matriculas_especializacion: MatriculaEspecializacion[];
}
