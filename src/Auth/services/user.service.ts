import { DatabaseError } from "../../errors/DatabaseError";
import { Usuario } from "../entity/Usuario.entity";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import { uploadImage } from "../../helpers/uploadImage";

export class UserService {
    public async findByUser(user: string) {
        try {
            const userExists = await Usuario.createQueryBuilder("u")
                .innerJoinAndSelect("u.rol", "r")
                .where("u.usuario = :user", { user })
                .getOne();

            return userExists || null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    public async findById(uuid: string) {
        try {
            const userExists = await Usuario.createQueryBuilder("u")
                .innerJoinAndSelect("u.rol", "r")
                .where("u.uuid=:uuid", { uuid })
                .getOne();
            return userExists;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async updateAvatar(uuid: string, image: fileUpload.UploadedFile) {
        try {
            const user = await Usuario.findOneBy({ uuid });

            if (!user)
                throw new DatabaseError(
                    "User not found",
                    500,
                    "Internal server error"
                );

            user.avatar = await uploadImage(user.avatar, image, "user-avatars");
            await user.save();
            await user.reload();

            return user;
        } catch (error) {
            throw error;
        }
    }
}
