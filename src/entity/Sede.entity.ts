import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Direccion } from "./Direccion.entity";
import { Docente } from "./Docente.entity";
import { Secretaria } from "./Secretaria.entity";

@Entity()
export class Sede extends EntityBase {
    @Column()
    nombre: string;

    @OneToOne(() => Direccion)
    @JoinColumn()
    direccion: Direccion;

    @OneToMany(() => Docente, (docente) => docente.sede)
    docentes: Docente[];

    @OneToMany(() => Secretaria, (secretaria) => secretaria.sede)
    secretarias: Secretaria[];
}
