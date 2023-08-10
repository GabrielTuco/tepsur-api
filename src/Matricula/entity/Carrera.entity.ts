import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Modulo } from "./Modulo.entity";
import { Grupo } from "./Grupo.entity";
import { Matricula } from "./Matricula.entity";
import { TIPO_CARRERA } from "../../interfaces/enums";
import { Sede } from "../../Sede/entity";
import { TarifaPensionCarrera } from "./TarifaPensionCarrera.entity";

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

    @OneToMany(() => Modulo, (modulo) => modulo.carrera)
    modulos: Modulo[];

    @OneToMany(() => Matricula, (matricula) => matricula.carrera, {
        nullable: true,
    })
    matriculas: Matricula[];

    @Column({ type: "varchar" })
    tipo_carrera: TIPO_CARRERA;

    @Column({ default: "activo" })
    estado: string;

    @ManyToMany(() => Sede, (sede) => sede.carreras)
    sedes: Sede[];

    @OneToMany(() => TarifaPensionCarrera, (tarifa) => tarifa.carrera)
    tarifas: TarifaPensionCarrera[];
}
