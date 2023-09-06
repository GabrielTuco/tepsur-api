import { Column, Entity, ManyToOne } from "typeorm";
import { EntityBase } from "../../entity";
import { Matricula } from "../../Matricula/entity";

@Entity()
export class Certificado extends EntityBase {
    @Column({ type: "varchar" })
    descripcion: string;

    @Column({ type: "varchar" })
    url: string;

    @ManyToOne(() => Matricula, (matricula) => matricula.certificados)
    matricula: Matricula;
}
