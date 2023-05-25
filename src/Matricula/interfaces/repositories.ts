import fileUpload from "express-fileupload";
import { Alumno } from "../../Student/entity/Alumno.entity";
import {
    Carrera,
    Grupo,
    Horario,
    Matricula,
    MetodoPago,
    Modulo,
    PagoMatricula,
} from "../entity";
import {
    AlumnoData,
    CareerDTO,
    GroupDTO,
    MatriculaDTO,
    ModuleDTO,
    ScheduleDTO,
} from "./dtos";
import { Response } from "express";

export interface ModuleRepository {
    register(data: ModuleDTO): Promise<Modulo>;
    findByUuid(uuid: string): Promise<Modulo>;
    findByName(name: string): Promise<Modulo>;
}

export interface CareerRepository {
    register(data: CareerDTO): Promise<Carrera>;
    listAll(): Promise<Carrera[]>;
    listModules(uuid: string): Promise<Modulo[]>;
    findByUuid(uuid: string): Promise<Carrera>;
    findByName(name: string): Promise<Carrera>;
    update(uuid: string, data: Partial<Carrera>): Promise<Carrera>;
    addModule(uuid: string, module: Partial<Modulo>): Promise<Carrera>;
    removeModule(uuid: string, moduleUuid: string): Promise<Carrera>;
}

export interface GroupRepository {
    register(data: GroupDTO): Promise<Grupo>;
    listGroups(): Promise<Grupo[]>;
    listEstudents(uuid: string): Promise<any>; //TODO Debe retornar un arreglo de matriculas o alumnos
    findByUuid(uuid: string): Promise<Grupo>;
    findByName(name: string): Promise<Grupo>;
}

export interface ScheduleRepository {
    register(data: ScheduleDTO): Promise<Horario>;
    listAll(): Promise<Horario[]>;
    findByUuid(uuid: string): Promise<Horario>;
    update(uuid: string, data: Partial<Horario>): Promise<Horario>;
    delete(uuid: string): Promise<void>;
}

export interface MatriculaRepository {
    register(data: MatriculaDTO): Promise<Matricula>;
    uploadPaidDocument(
        uuid: string,
        image: fileUpload.UploadedFile
    ): Promise<PagoMatricula>;
    findByStudent(uuid: number): Promise<Matricula>;
    findByUuid(uuid: number): Promise<Matricula>;
    registerStudent(data: AlumnoData): Promise<Alumno>;
    generatePDF(
        uuid: string,
        doc: PDFKit.PDFDocument,
        stream: Response<any, Record<string, any>>
    ): Promise<any>;
    update(uuid: string, data: Partial<MatriculaDTO>): Promise<Matricula>;
    delete(uuid: string): Promise<Matricula>;
}

export interface MetodoPagoRepository {
    register(description: string): Promise<MetodoPago>;
    getAll(): Promise<MetodoPago[]>;
    update(uuid: string, description: string): Promise<MetodoPago>;
}
