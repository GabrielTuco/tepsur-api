import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Modulo } from "./Modulo.entity";
import { Grupo } from "./Grupo.entity";
import { Matricula } from "./Matricula.entity";
import { TIPO_CARRERA } from "../../interfaces/enums";

@Entity()
export class Carrera extends EntityBase {
    @Column()
    num_modulos: number;

    @Column()
    nombre: string;

    @Column()
    duracion_meses: number;

    @OneToMany(() => Grupo, (grupo) => grupo.carrera, { nullable: true })
    grupos: Grupo[];

    @ManyToMany(() => Modulo)
    @JoinTable()
    modulos: Modulo[];

    @OneToMany(() => Matricula, (matricula) => matricula.carrera, {
        nullable: true,
    })
    matriculas: Matricula[];

    @Column()
    tipo_carrera: TIPO_CARRERA;
}
