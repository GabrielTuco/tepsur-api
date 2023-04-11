import { SwaggerOptions, SwaggerUiOptions } from "swagger-ui-express";

export const options: SwaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Plataforma Tepsur API",
            version: "1.0.0",
            description: "Api de la plataforma virtual tepsur",
        },
        servers: [
            {
                url: "http://localhost:5000/api",
            },
        ],
    },
    apis: ["./src/**/*.routes.ts"],
};
