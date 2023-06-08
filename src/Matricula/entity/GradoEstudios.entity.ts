import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Alumno } from "../../Student/entity/Alumno.entity";

@Entity()
export class GradoEstudios extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid: number;

    @Column()
    descripcion: string;

    @OneToMany(() => Alumno, (alumno) => alumno.grado_estudios)
    alumnos: Alumno[];

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;
}
