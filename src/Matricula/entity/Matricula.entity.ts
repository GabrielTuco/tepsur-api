import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { EntityBase } from "../../entity";
import { Carrera } from "./Carrera.entity";
import { Alumno } from "../../Student/entity/Alumno.entity";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { PagoMatricula } from "./PagoMatricula.entity";
import { Pension } from "../../Pension/entity/Pension.entity";
import { TIPO_MATRICULA } from "../../interfaces/enums";
import { MatriculaGruposGrupo } from "./MatriculaGruposGrupo.entity";
import { MatriculaModulosModulo } from "./MatriculaModulosModulo";

@Entity()
export class Matricula extends EntityBase {
  @ManyToOne(() => Carrera, (carrera) => carrera.matriculas)
  carrera: Carrera;

  @OneToOne(() => Alumno)
  @JoinColumn()
  alumno: Alumno;

  @OneToMany(
    () => MatriculaGruposGrupo,
    (matriculaGruposGrupo) => matriculaGruposGrupo.matricula
  )
  matriculaGruposGrupo: MatriculaGruposGrupo[];

  @OneToMany(
    () => MatriculaModulosModulo,
    (matriculaModulosModulo) => matriculaModulosModulo.matricula
  )
  matriculaModulosModulo: MatriculaModulosModulo[];

  @ManyToOne(() => Secretaria, (secretaria) => secretaria.matriculas)
  secretaria: Secretaria;

  @ManyToOne(() => Sede, (sede) => sede.matriculas)
  sede: Sede;

  @OneToOne(() => PagoMatricula, { nullable: true })
  @JoinColumn()
  pagoMatricula: PagoMatricula;

  @OneToMany(() => Pension, (pension) => pension.matricula)
  pensiones: Pension[];

  @Column()
  fecha_inscripcion: Date;

  @Column({ nullable: true })
  fecha_inicio: Date;

  @Column({ type: "varchar", nullable: true })
  tipo_matricula: TIPO_MATRICULA;
}
