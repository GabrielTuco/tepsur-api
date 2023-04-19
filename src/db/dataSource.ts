import { DataSource, DataSourceOptions } from "typeorm";
import yargs from "yargs/yargs";

import { Alumno } from "../entity/Alumno.entity";
import { Direccion } from "../entity/Direccion.entity";
import { Secretaria } from "../Secretary/entity/Secretaria.entity";
import { Docente } from "../entity/Docente.entity";
import { Usuario } from "../Auth/entity/Usuario.entity";
import { Rol } from "../Auth/entity/Rol.entity";
import { Sede } from "../Sede/entity/Sede.entity";
import { Permiso } from "../Auth/entity/Permiso.entity";
import { Administrador } from "../entity/Administrador.entity";

//Yargs config
const argv = yargs(process.argv.slice(2))
    .options({
        dev: { type: "boolean" },
    })
    .parseSync();

let dataSourceOptions: object;

if (!!argv.dev) {
    dataSourceOptions = {
        port: parseInt(`${process.env.DEV_DB_PORT}`) || 5432,
        username: `${process.env.DEV_DB_USER}`,
        host: `${process.env.DEV_DB_HOST}`,
        database: `${process.env.DEV_DB_NAME}`,
        password: `${process.env.DEV_DB_PASSWORD}`,
    };
} else {
    dataSourceOptions = {
        port: parseInt(`${process.env.DB_PORT}`) || 5432,
        username: `${process.env.DB_USER}`,
        host: `${process.env.DB_HOST}`,
        database: `${process.env.DB_NAME}`,
        password: `${process.env.DB_PASSWORD}`,
    };
}

export const AppDataSource = new DataSource({
    type: "postgres",
    ...dataSourceOptions,
    synchronize: true,
    logging: false,
    entities: [
        Administrador,
        Alumno,
        Secretaria,
        Docente,
        Usuario,
        Rol,
        Permiso,
        Direccion,
        Sede,
    ],
    migrations: [],
    subscribers: [],
});
