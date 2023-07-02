import { DataSource } from "typeorm";
import yargs from "yargs/yargs";

import { Direccion } from "../entity/Direccion.entity";
import { Secretaria } from "../Secretary/entity/Secretaria.entity";
import { Docente } from "../Teacher/entity/Docente.entity";
import { Usuario } from "../Auth/entity/Usuario.entity";
import { Rol } from "../Auth/entity/Rol.entity";
import { Sede } from "../Sede/entity/Sede.entity";
import { Permiso } from "../Auth/entity/Permiso.entity";
import { Administrador } from "../entity/Administrador.entity";
import { Alumno } from "../Student/entity/Alumno.entity";

import {
  Carrera,
  GradoEstudios,
  Grupo,
  Matricula,
  Modulo,
  PagoMatricula,
} from "../Matricula/entity";
import { Horario } from "../Matricula/entity/Horario.entity";
import { MetodoPago } from "../Matricula/entity/MetodoPago.entity";
import { Pension } from "../Pension/entity/Pension.entity";
import { PagoPension } from "../Pension/entity/PagoPension.entity";
import { MatriculaModulosModulo } from "../Matricula/entity/MatriculaModulosModulo.entity";
import { TarifaPensionCarrera } from "../Matricula/entity/TarifaPensionCarrera.entity";

//Yargs config
const argv = yargs(process.argv.slice(2))
  .options({
    develop: { type: "boolean" },
  })
  .parseSync();

let dataSourceOptions: object;

if (!!argv.develop) {
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
    Carrera,
    Modulo,
    Grupo,
    Horario,
    GradoEstudios,
    Matricula,
    MatriculaModulosModulo,
    PagoMatricula,
    MetodoPago,
    Pension,
    PagoPension,
    TarifaPensionCarrera
  ],
  migrations: [],
  subscribers: [],
});
