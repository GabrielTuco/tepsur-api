import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Usuario } from "../entity/Usuario.entity";

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


    public async updateAvatar(uuid:number, avatarUrl: string){
        try {
            const user = await Usuario.findOneBy({id:uuid});
            if(!user) throw new DataBaseError("User not found in database",500,"");
                
            user.avatar = avatarUrl
            await user.save();
            await user.reload();

            return user;
        } catch (error) {
            throw error
        }
    }
}
