import { DataSource } from "typeorm";
import { Alumno } from "../entity/Alumno.entity";
import { Secretaria } from "../entity/Secretaria.entity";
import { Docente } from "../entity/Docente.entity";
import { Usuario } from "../entity/Usuario.entity";
import { Rol } from "../entity/Rol.entity";
import { Direccion } from "../entity/Direccion.entity";
import { Sede } from "../entity/Sede.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    port: parseInt(`${process.env.DB_PORT}`) || 5432,
    username: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASSWORD}`,
    synchronize: true,
    logging: false,
    entities: [Alumno, Secretaria, Docente, Usuario, Rol, Direccion, Sede],
    migrations: [],
    subscribers: [],
});
