import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { EntityBase } from "../../entity";
import { MatriculaEspecializacion } from "./MatriculaEspecializacion.entity";
import { Sede } from "../../Sede/entity";

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

    @ManyToMany(() => Sede, (sede) => sede.especializaciones)
    sedes: Sede[];

    @OneToMany(
        () => MatriculaEspecializacion,
        (matriculaEspe) => matriculaEspe.especializacion
    )
    matriculas_especializacion: MatriculaEspecializacion[];
}
