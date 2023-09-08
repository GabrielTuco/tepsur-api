import { ifError } from "assert";
import { v2 as cloudinary } from "cloudinary";

/**
 *
 * @param stringURL {string} - URL de la imagen almacenada en la base de datos
 * @param folderName {string} - nombre del folder donde se encuentra la imagen a eliminar
 */
export const deleteImage = async (stringURL: string, folderName: string) => {
    try {
        const nombreArr = stringURL.split("/");
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split(".");

        await cloudinary.uploader.destroy(`tepsur/${folderName}/` + public_id);
    } catch (error) {
        throw ifError;
    }
};
