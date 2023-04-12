import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
    async postLogin(req:Request, res:Response){
        //Obtener el id del usuario
        //determinar si es alumno, docente, secretaria o administrador
        //validar si el usuario tiene un registro de alumno, docente, secretaria o administador vinculado
        //Validar la sede a la que pertenece el usuario
        //Validar la contraseña
        //Generar token
        //Enviar respuesta con el token de autenticacion y la informacion del usuario y 
        try {
            const {usuario, password, role} = req.body
        } catch (error) {
            console.log(error)
            res.status(500).json({
                msg:"contact the administrator"
            })
        }
    }
}
