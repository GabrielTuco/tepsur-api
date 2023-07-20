import { Column, Entity } from "typeorm";
import { EntityBase } from "../../entity";

@Entity()
export class Especializacion extends EntityBase {
    @Column()
    nombre: string;

    @Column()
    duracion_semanas: number;

    @Column()
    precio: number;

    @Column({ default: true })
    estado: boolean;
}
