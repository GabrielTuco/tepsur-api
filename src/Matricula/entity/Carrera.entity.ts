import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Modulo } from "./Modulo.entity";
import { Grupo } from "./Grupo.entity";
import { Matricula } from "./Matricula.entity";
import { Horario } from "./Horario.entity";

@Entity()
export class Carrera extends EntityBase {
    @Column({ unique: true })
    uuid: string;

    @Column()
    num_modulos: number;

    @Column()
    nombre: string;

    @Column()
    modalidad: string;

    @OneToMany(() => Grupo, (grupo) => grupo.carrera, { nullable: true })
    grupos: Grupo[];

    @ManyToMany(() => Modulo)
    @JoinTable()
    modulos: Modulo[];

    @OneToMany(() => Matricula, (matricula) => matricula.carrera, {
        nullable: true,
    })
    matriculas: Matricula[];

    @ManyToMany(() => Horario)
    @JoinTable()
    horarios: Horario[]
}
