import { CreateMatEspeDto } from "../../Matricula/dto/createMatriculaEspecializacion.dto";
import { UpdateMatEspeDto } from "../../Matricula/dto/updateMatriculaEspecializacion.dto";
import { RegisterEspecializacionDto } from "../dto/registerEspecializacion.dto";
import { Especializacion } from "../entity/Especializacion.entity";
import { MatriculaEspecializacion } from "../entity/MatriculaEspecializacion.entity";

export interface EspecializacionRepository {
    register(data: RegisterEspecializacionDto): Promise<Especializacion>;
    listAll(): Promise<Especializacion[]>;
    findByUuid(uuid: string): Promise<Especializacion>;
    update(
        uuid: string,
        data: Partial<RegisterEspecializacionDto>
    ): Promise<Especializacion>;
    delete(uuid: string): Promise<Especializacion>;
}

export interface MatriculaEspecializacionRepository {
    register(data: CreateMatEspeDto): Promise<MatriculaEspecializacion>;
    listAll(year: string, month: string): Promise<MatriculaEspecializacion[]>;
    findByUuid(uuid: string): Promise<MatriculaEspecializacion>;
    update(
        uuid: string,
        data: UpdateMatEspeDto
    ): Promise<MatriculaEspecializacion>;
    delete(uuid: string): Promise<MatriculaEspecializacion>;
}
