import fileUpload from "express-fileupload";
import {
    Carrera,
    Grupo,
    Horario,
    Matricula,
    MetodoPago,
    Modulo,
    PagoMatricula,
    TarifaPensionCarrera,
} from "../entity";
import {
    RegisterCareerDto,
    GroupDTO,
    GrupoWithStudents,
    MatriculaDTO,
    ModuleDTO,
    ModuloMatriculaDTO,
    PagoMatriculaData,
    ScheduleDTO,
    TrasladoMatriculaDTO,
    UpdateMatriculaDto,
    UpdateCareerDto,
} from "./dtos";
import { MODALIDAD } from "../../interfaces/enums";
import { MatriculaEspecializacion } from "../../Especializacion/entity/MatriculaEspecializacion.entity";
import { Pension } from "../../Pension/entity";
import { CreateTarifaPensionDto } from "../dto/createTarifaPension.dto";

export interface ModuleRepository {
    register(data: ModuleDTO): Promise<Modulo>;
    findByUuid(uuid: string): Promise<Modulo>;
    findByName(name: string): Promise<Modulo>;
}

export interface CareerRepository {
    register(data: RegisterCareerDto): Promise<Carrera>;
    listAll(): Promise<Carrera[]>;
    listBySede(uuid: string): Promise<Carrera[]>;
    listModules(uuid: string): Promise<Modulo[]>;
    findByUuid(uuid: string): Promise<Carrera>;
    findByName(name: string): Promise<Carrera>;
    update(uuid: string, data: UpdateCareerDto): Promise<Carrera>;
    addModule(uuid: string, module: Partial<Modulo>): Promise<Carrera>;
    removeModule(uuid: string, moduleUuid: string): Promise<Carrera>;
    delete(uuid: string): Promise<Carrera>;
}

export interface GroupRepository {
    register(data: GroupDTO): Promise<Grupo>;
    addStudent(
        mat: { matriculaUuid: string; observaciones: string }[],
        grup: string,
        secre: string
    ): Promise<Grupo>;
    listGroups(
        year: string | undefined,
        month: string | undefined
    ): Promise<Grupo[]>;
    listEstudents(uuid: string): Promise<Matricula[]>;
    findByUuid(uuid: string): Promise<GrupoWithStudents>;
    findByName(n: string): Promise<Grupo>;
}

export interface ScheduleRepository {
    register(data: ScheduleDTO): Promise<Horario>;
    listAll(): Promise<Horario[]>;
    listBySecretary(s: string): Promise<Horario[]>;
    findByUuid(uuid: string): Promise<Horario>;
    update(uuid: string, data: Partial<Horario>): Promise<Horario>;
    delete(uuid: string): Promise<Horario>;
    //listPerCareer(carreraUuid: string): Promise<Horario[]>;
}

export interface MatriculaRepository {
    register(data: MatriculaDTO): Promise<Matricula>;
    registerPensiones(
        matricula: Matricula,
        carreraUuid: string,
        modulosMatriculados: number
    ): Promise<void>;
    setRandomGroup(horarioUuid: string): Promise<Grupo>;
    setModulesForMatricula(
        matriculaUuid: string,
        modulosMatricula: ModuloMatriculaDTO[]
    ): Promise<Matricula>;
    uploadPaidDocument(
        uuid: string,
        image: fileUpload.UploadedFile
    ): Promise<Matricula | MatriculaEspecializacion>;
    getAll(
        year: string | undefined,
        month: string | undefined
    ): Promise<Matricula[]>;
    findByStudent(uuid: number): Promise<Matricula>;
    findByUuid(uuid: string): Promise<any>;
    findByQuery(
        query: string
    ): Promise<{ matricula: Matricula; ultimoPago: Pension }[]>;
    matriculaDataForPDF(uuid: string): Promise<any>;
    updatePagoMatricula(
        uuid: string,
        data: PagoMatriculaData
    ): Promise<PagoMatricula>;
    update(uuid: string, data: UpdateMatriculaDto): Promise<Matricula>;
    delete(uuid: string): Promise<Matricula>;
    listModules(): Promise<Modulo[]>;
    changeSede(matriculaUuid: string, sedeUuid: string): Promise<Matricula>;
    changeModalidadModulo(
        matriculaUuid: string,
        moduloUuid: string,
        modalidad: MODALIDAD
    ): Promise<Matricula>;
    changeHorario(
        matriculaUuid: string,
        moduloUuid: string
    ): Promise<Matricula>;
    trasladoAlumno(data: TrasladoMatriculaDTO): Promise<Matricula>;
}

export interface MetodoPagoRepository {
    register(description: string): Promise<MetodoPago>;
    getAll(): Promise<MetodoPago[]>;
    update(uuid: number, description: string): Promise<MetodoPago>;
}

export interface UbigeoRepository {
    listDepartaments(): Promise<string[]>;
    listProvinces(id: string): Promise<string[]>;
    listDistricts(depId: string, provId: string): Promise<string[]>;
}

export interface TarifaPensionCarreraRepository {
    register(data: CreateTarifaPensionDto): Promise<TarifaPensionCarrera>;
    listAll(): Promise<TarifaPensionCarrera[]>;
    findByUuid(uuid: string): Promise<TarifaPensionCarrera>;
    findByCarreraUuid(carreraUuid: string): Promise<TarifaPensionCarrera>;
    update(uuid: string, data: any): Promise<TarifaPensionCarrera>;
    delete(uuid: string): Promise<TarifaPensionCarrera>;
}
