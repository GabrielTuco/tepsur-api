import { Column, Entity } from "typeorm";
import { EntityBase } from "../entity";

@Entity()
export class Modulo extends EntityBase {
    @Column()
    nombre: string;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ nullable: true })
    url_video: string;
}
