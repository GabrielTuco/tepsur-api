import { Column, Entity, OneToOne } from "typeorm";
import { EntityBase } from "../../entity";
import { Alumno } from "../../Student/entity/Alumno.entity";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { Horario, Modulo } from "../../Matricula/entity";

@Entity()
export class Especializacion extends EntityBase {

  @OneToOne(() => Alumno)
  alumno: Alumno;

  @OneToOne(() => Docente)
  docente: Docente;

  @OneToOne(() => Modulo)
  modulo: Modulo;

  @OneToOne(() => Horario)
  horario: Horario;

  @Column()
  fecha_inicio: Date;

  @Column({ default: 'activo' }) //activo | iniciado | terminado
  estado: string;

}
