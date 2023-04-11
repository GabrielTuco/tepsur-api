import { Column, Entity, JoinColumn, OneToOne, Unique } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Direccion } from "./Direccion.entity";
import { Usuario } from "../Auth/entity/Usuario.entity";

@Entity()
export class Alumno extends EntityBase {
    @Column({ unique: true, length: 8 })
    dni: string;

    @Column()
    nombres: string;

    @Column()
    ape_paterno: string;

    @Column()
    ape_materno: string;

    @Column()
    sexo: string;

    @Column()
    edad: number;

    @Column({ nullable: true })
    est_civil: string;

    @Column({ nullable: true })
    grado_estudios: string;

    @Column({ nullable: true })
    lugar_nacimiento: string;

    @Column({ length: 9, nullable: true })
    telefono: string;

    @Column({ nullable: true })
    correo: string;

    @Column({ default: true })
    estado: boolean;

    @Column({ nullable: true })
    ultimo_grupo: string;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;

    @OneToOne(() => Direccion)
    @JoinColumn()
    direccion: Direccion;
}
