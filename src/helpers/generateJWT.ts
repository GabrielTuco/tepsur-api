import jwt from "jsonwebtoken";

export const generateJWT = (id: number, user: string) => {
    return new Promise((resolve, reject) => {
        const payload = { id, user };

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY as string,
            {
                expiresIn: "4h",
            },
            (error, token) => {
                if (error) {
                    console.log(error);
                    reject("No se pudo generar el token");
                } else {
                    resolve(token);
                }
            }
        );
    });
};
