import fileUpload from "express-fileupload";

export class CreateCertificadoDto {
    descripcion: string;
    image: fileUpload.UploadedFile;
    matriculaUuid: string;
}
