import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { Direccion, EntityBase } from "../../entity";
import { Usuario } from "../../Auth/entity";
import { GradoEstudios } from "../../Matricula/entity";

@Entity()
export class Alumno extends EntityBase {
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

    @Column()
    sexo: "m" | "f";

    @Column({ nullable: true })
    edad: number;

    @Column({ nullable: true })
    estado_civil: string;

    @ManyToOne(() => GradoEstudios, (gradoEstudios) => gradoEstudios.alumnos)
    grado_estudios: GradoEstudios;

    @Column({ nullable: true })
    lugar_nacimiento: string;

    @Column({ nullable: true })
    celular: string;

    @Column({ nullable: true })
    correo: string;

    @Column({ default: false })
    estado: boolean;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;

    @OneToOne(() => Direccion)
    @JoinColumn()
    direccion: Direccion;

    //TODO: ultimo_grupo
}
