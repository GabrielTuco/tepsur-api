import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Usuario } from "./Usuario.entity";
import { Sede } from "./Sede.entity";

@Entity()
export class Secretaria extends EntityBase {
    @Column()
    nombre: string;

    @Column()
    ape_paterno: string;

    @Column()
    ape_materno: string;

    @Column({ length: 9 })
    celular: string;

    @Column()
    correo: string;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;

    @ManyToOne(() => Sede, (sede) => sede.secretarias)
    sede: Sede;
}
