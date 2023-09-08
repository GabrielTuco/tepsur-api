import { Matricula } from "../../Matricula/entity";
import { NotFoundError } from "../../errors/NotFoundError";
import { deleteImage } from "../../helpers/deleteImage";
import { uploadImage } from "../../helpers/uploadImage";
import { CreateCertificadoDto } from "../dto/createCertificado.dto";
import { Certificado } from "../entity/Certificado.entity";
import { v4 as uuid } from "uuid";

interface CertificadoRepository {
    register: (d: CreateCertificadoDto) => Promise<Certificado>;
    findByUuid: (u: string) => Promise<Certificado>;
    listAll: () => Promise<Certificado[]>;
    listByMatricula: (m: string) => Promise<Certificado[]>;
    delete: (uuid: string) => Promise<string>;
}

export class CertificadoService implements CertificadoRepository {
    public register = async (
        data: CreateCertificadoDto
    ): Promise<Certificado> => {
        try {
            const { descripcion, image, matriculaUuid } = data;
            const matricula = await Matricula.findOneBy({
                uuid: matriculaUuid,
            });
            if (!matricula) throw new NotFoundError("La matricula no existe");

            const newCertificado = new Certificado();
            newCertificado.uuid = uuid();
            newCertificado.descripcion = descripcion;
            newCertificado.url = await uploadImage(
                undefined,
                image,
                "certificados"
            );
            newCertificado.matricula = matricula;

            await newCertificado.save();

            return newCertificado;
        } catch (error) {
            throw error;
        }
    };

    public findByUuid = async (uuid: string): Promise<Certificado> => {
        try {
            const certificado = await Certificado.findOne({
                where: { uuid },
                relations: { matricula: true },
            });
            if (!certificado)
                throw new NotFoundError("El certificado no existe");

            return certificado;
        } catch (error) {
            throw error;
        }
    };

    public listAll = async (): Promise<Certificado[]> => {
        try {
            return Certificado.find({
                relations: {
                    matricula: true,
                },
            });
        } catch (error) {
            throw error;
        }
    };

    public listByMatricula = async (
        matriculaUuid: string
    ): Promise<Certificado[]> => {
        try {
            return Certificado.find({
                relations: {
                    matricula: true,
                },
                where: {
                    matricula: { uuid: matriculaUuid },
                },
            });
        } catch (error) {
            throw error;
        }
    };

    public delete = async (uuid: string): Promise<string> => {
        try {
            const certificado = await Certificado.findOneBy({ uuid });

            if (!certificado)
                throw new NotFoundError("El certificado no existe");

            await deleteImage(certificado.url, "certificados");

            await Certificado.remove(certificado);

            return uuid;
        } catch (error) {
            throw error;
        }
    };
}
