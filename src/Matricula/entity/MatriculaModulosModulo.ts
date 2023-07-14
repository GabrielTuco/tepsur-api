import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { ESTADO_MODULO_MATRICULA, MODALIDAD } from "../../interfaces/enums";
import { Matricula } from "./Matricula.entity";
import { Modulo } from "./Modulo.entity";

@Entity()
export class MatriculaModulosModulo extends BaseEntity {
  @PrimaryColumn()
  uuid: string;

  @Column({ type: "varchar" })
  estado: ESTADO_MODULO_MATRICULA;

  @Column({ nullable: true })
  fecha_inicio: Date;

  @Column({ type: "varchar", nullable: true })
  modalidad: MODALIDAD;

  @ManyToOne(() => Matricula, (matricula) => matricula.matriculaModulosModulo)
  matricula: Matricula;

  @ManyToOne(() => Modulo, (modulo) => modulo.matriculaModulosModulo)
  modulo: Modulo;
}
