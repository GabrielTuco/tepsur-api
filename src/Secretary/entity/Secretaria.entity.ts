import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Usuario } from "../../Auth/entity/Usuario.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { Matricula } from "../../Matricula/entity";

@Entity()
export class Secretaria extends EntityBase {
    @PrimaryColumn()
    uuid: string;

    @Column({ length: 8, unique: true })
    dni: string;

    @Column()
    nombres: string;

    @Column()
    ape_paterno: string;

    @Column()
    ape_materno: string;

    @Column({ nullable: true, length: 9 })
    celular: string;

    @Column({ nullable: true })
    correo: string;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;

    @ManyToOne(() => Sede, (sede) => sede.secretarias)
    sede: Sede;

    @OneToMany(() => Matricula, (matricula) => matricula.secretaria)
    matriculas: Matricula[];
}
