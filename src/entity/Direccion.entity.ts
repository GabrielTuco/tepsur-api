import { Column, Entity } from "typeorm";
import { EntityBase } from "./EntityBase";

@Entity()
export class Direccion extends EntityBase {
    @Column({ unique: true })
    direccion_exacta: string;

    @Column()
    distrito: string;

    @Column()
    provincia: string;

    @Column()
    departamento: string;
}
