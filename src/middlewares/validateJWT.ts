import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    user: string;
}

declare module "express-serve-static-core" {
    interface Request {
        user: string;
    }
}

export const validateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header("access-token");

    if (!token) {
        return res.status(401).json({
            msg: "Se necesita enviar el token de autenticacion",
        });
    }
    try {
        const { user } = jwt.verify(
            token,
            process.env.SECRETORPRIVATEKEY as string
        ) as JwtPayload;

        //const usuario = await userService.searchById(id);

        //Validar que el usuario exista en la base de datos
        // if (!usuario) {
        //     return res.status(401).json({
        //         msg: "Token no valido",
        //     });
        // }

        // req.user = usuario.user;

        next();
        return;
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: "Token invalido",
        });
    }
};
