import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
} from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Direccion } from "../../entity/Direccion.entity";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import {
    Carrera,
    Grupo,
    Matricula,
    TarifaPensionCarrera,
} from "../../Matricula/entity";
import { Administrador } from "../../entity";
import { MatriculaEspecializacion } from "../../Especializacion/entity/MatriculaEspecializacion.entity";
import { Especializacion } from "../../Especializacion/entity/Especializacion.entity";

@Entity()
export class Sede extends EntityBase {
    @Column({ unique: true })
    nombre: string;

    @Column({ default: "activo" })
    estado: string;

    @OneToOne(() => Direccion)
    @JoinColumn()
    direccion: Direccion;

    @OneToMany(() => Docente, (docente) => docente.sede)
    docentes: Docente[];

    @OneToMany(() => Secretaria, (secretaria) => secretaria.sede)
    secretarias: Secretaria[];

    @OneToMany(() => Grupo, (grupo) => grupo.sede)
    grupos: Grupo[];

    @OneToOne(() => Administrador, (admin) => admin.sede, { nullable: true })
    @JoinColumn()
    administrador: Administrador | null;

    @ManyToMany(() => Carrera, (carrera) => carrera.sedes)
    @JoinTable()
    carreras: Carrera[];

    @ManyToMany(
        () => Especializacion,
        (especializacion) => especializacion.sedes
    )
    @JoinTable()
    especializaciones: Especializacion[];

    @OneToMany(() => Matricula, (matricula) => matricula.sede)
    matriculas: Matricula[];

    @OneToMany(
        () => MatriculaEspecializacion,
        (matriculaEspe) => matriculaEspe.sede
    )
    matriculas_especializacion: MatriculaEspecializacion[];

    @OneToMany(() => TarifaPensionCarrera, (tarifa) => tarifa.sede)
    tarifas: TarifaPensionCarrera[];
}
