import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { UserService } from "../services/user.service";

const userService = new UserService()

export class UserController{
    public async patchUserAvatar(req:Request, res:Response){
        const { id } = req.params
    
        try {
    
            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).json({ msg: 'No hay imagen para subir.' });
                return;
            }
    
            if (!req.files.image || Object.keys(req.files).length === 0) {
                res.status(400).json({ msg: 'No hay imagen para subir.' });
                return;
            }
    
            const user = await userService.updateAvatar(Number(id),req.files.image as fileUpload.UploadedFile)
    
    
            return res.json({
                user
            })
        } catch (error) {
            console.log(error);
            
            return res.status(500).json({
                err:'Ocurrio un error'
            })
        }
    }
}