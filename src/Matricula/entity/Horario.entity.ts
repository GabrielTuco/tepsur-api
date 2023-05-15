import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { EntityBase } from "../../entity";
import { Grupo } from "./Grupo.entity";

@Entity()
export class Horario extends EntityBase {
    @Column({ unique: true })
    uuid: string;

    @Column()
    turno: string;

    @Column()
    dias: string;

    @Column()
    hora_inicio: number;

    @Column()
    hora_fin: number;

    @Column({ default: true })
    estado: boolean;

    @OneToMany(() => Grupo, (grupo) => grupo.horario)
    grupos: Grupo[];
}
