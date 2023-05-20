import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";

export const uploadImage = async (
    stringURL: string | undefined,
    image: fileUpload.UploadedFile,
    folderName: string
) => {
    if (stringURL) {
        const nombreArr = stringURL.split("/");
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split(".");

        cloudinary.uploader.destroy(`tepsur/${folderName}/` + public_id); //Eliminar la imagen si existe
    }

    const { secure_url } = await cloudinary.uploader.upload(
        image.tempFilePath,
        { folder: `tepsur/${folderName}` }
    );
    return secure_url;
};
