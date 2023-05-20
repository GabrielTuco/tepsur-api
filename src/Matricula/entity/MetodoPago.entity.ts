import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class MetodoPago {
   @PrimaryColumn()
   uuid: string

   @Column()
   description: string

}