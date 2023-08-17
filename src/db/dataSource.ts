import { DataSource } from "typeorm";
import dataSourceOptions from "./getDataSourceOptions";

import { Direccion } from "../entity/Direccion.entity";
import { Secretaria } from "../Secretary/entity/Secretaria.entity";
import { Docente } from "../Teacher/entity/Docente.entity";
import { Usuario } from "../Auth/entity/Usuario.entity";
import { Rol } from "../Auth/entity/Rol.entity";
import { Sede } from "../Sede/entity/Sede.entity";
import { Administrador } from "../Administrator/entity/Administrador.entity";
import { Alumno } from "../Student/entity/Alumno.entity";
import {
    Carrera,
    GradoEstudios,
    Grupo,
    Matricula,
    Modulo,
    PagoMatricula,
    Horario,
    MatriculaGruposGrupo,
    MetodoPago,
    TarifaPensionCarrera,
} from "../Matricula/entity";
import { Pension } from "../Pension/entity/Pension.entity";
import { PagoPension } from "../Pension/entity/PagoPension.entity";
import { Especializacion } from "../Especializacion/entity/Especializacion.entity";
import { MatriculaModulosModulo } from "../Matricula/entity/MatriculaModulosModulo";
import { MatriculaEspecializacion } from "../Especializacion/entity/MatriculaEspecializacion.entity";

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
        Direccion,
        Sede,
        Carrera,
        Modulo,
        Grupo,
        Horario,
        GradoEstudios,
        Matricula,
        Especializacion,
        MatriculaEspecializacion,
        MatriculaGruposGrupo,
        MatriculaModulosModulo,
        Especializacion,
        PagoMatricula,
        MetodoPago,
        Pension,
        PagoPension,
        TarifaPensionCarrera,
    ],
    migrations: [],
    subscribers: [],
});
