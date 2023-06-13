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
            {
                url: "https://tepsur-api-production.up.railway.app/api",
            },
            {
                url: "https://arnoldolanda-potential-fiesta-7x4jqrgw7gq3xqjw-5000.preview.app.github.dev/api"
            }
        ],
    },
    apis: ["./src/**/*.routes.ts"],
};
