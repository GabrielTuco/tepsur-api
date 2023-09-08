import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";

/**
 *
 * @param {string|undefined} stringURL - Url del recurso a actualizar(segun sea el caso)
 * @param {fileUpload.UploadedFile} image - La imagen a subir en el hosting de archivos
 * @param {string} folderName - Nombre del folder donde se guardara la imagen
 * @returns {Promise<string>} Retorna la url de la imagen guardada
 */
export const uploadImage = async (
    stringURL: string | undefined,
    image: fileUpload.UploadedFile,
    folderName: string
) => {
    if (stringURL) {
        const nombreArr = stringURL.split("/");
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split(".");

        await cloudinary.uploader.destroy(`tepsur/${folderName}/` + public_id); //Eliminar la imagen si existe
    }

    const { secure_url } = await cloudinary.uploader.upload(
        image.tempFilePath,
        { folder: `tepsur/${folderName}` }
    );
    return secure_url;
};
