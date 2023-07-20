import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from "typeorm";
import { Direccion, EntityBase } from "../../entity";
import { Usuario } from "../../Auth/entity";
import { GradoEstudios, Matricula } from "../../Matricula/entity";
import { MatriculaEspecializacion } from "../../Especializacion/entity/MatriculaEspecializacion.entity";

@Entity()
export class Alumno extends EntityBase {
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

    @ManyToOne(() => GradoEstudios, (gradoEstudios) => gradoEstudios.alumnos)
    grado_estudios: GradoEstudios;

    @Column({ nullable: true })
    lugar_residencia: string;

    @Column({ nullable: true })
    celular: string;

    @Column({ nullable: true })
    celular_referencia: string;

    @Column({ nullable: true, unique: true })
    correo: string;

    @Column({ default: true })
    estado: boolean;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;

    @OneToOne(() => Direccion)
    @JoinColumn()
    direccion: Direccion;

    @OneToMany(() => Matricula, (matricula) => matricula.alumno)
    matriculas: Matricula[];

    @OneToMany(
        () => MatriculaEspecializacion,
        (matriculaEspe) => matriculaEspe.alumno
    )
    matriculas_especializacion: MatriculaEspecializacion[];
}
