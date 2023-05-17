import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Usuario } from "../entity/Usuario.entity";
import fileUpload from 'express-fileupload';
import { v2 as cloudinary} from 'cloudinary';

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
    public async findById(id: number) {
        try {
            const userExists = await Usuario.createQueryBuilder("u")
                .innerJoinAndSelect("u.rol", "r")
                .where("u.id=:id", { id })
                .getOne();
            return userExists;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async updateAvatar(uuid: number, image: fileUpload.UploadedFile) {
        try {
            const user = await Usuario.findOneBy( {id:uuid} );
    
            if(user){
    
                if(user.avatar){
                    const nombreArr = user.avatar.split('/');
                    const nombre = nombreArr[nombreArr.length-1];
                    const [public_id] = nombre.split('.');
                    
                    cloudinary.uploader.destroy( 'tepsur/user-avatars/' + public_id ); //Eliminar la imagen si existe
                }
        
        
                const { secure_url } = await cloudinary.uploader.upload(image.tempFilePath,{folder:'tepsur/user-avatars'})
        
                user.avatar = secure_url;
                await user.save();
                await user.reload();

                return user;
            }
        } catch (error) {
            throw error;
        }
    }
}
