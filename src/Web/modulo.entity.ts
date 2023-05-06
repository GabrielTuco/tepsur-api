import { Column, Entity } from "typeorm";
import { EntityBase } from "../entity";

@Entity({ name: "ModuloWeb", schema: "web" })
export class Modulo extends EntityBase {
    @Column({ unique: true })
    uuid: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column({ nullable: true })
    url_video: string;

    @Column("text", { array: true, nullable: true })
    images: string[];
}
