import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Usuario } from "../entity/Usuario.entity";

export class UserService {
    async findByUser(user: string) {
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
    async findById(id: number) {
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
}
