import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PagoMatricula } from "./PagoMatricula.entity";
import { PagoPension } from "../../Pension/entity";

@Entity()
export class MetodoPago extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid: number;

    @Column()
    description: string;

    @OneToMany(() => PagoMatricula, (pagoMatricula) => pagoMatricula.forma_pago)
    pagos_matricula: PagoMatricula[];

    @OneToMany(() => PagoPension, (pagoPension) => pagoPension.forma_pago)
    pagos_pension: PagoPension[];

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;
}
