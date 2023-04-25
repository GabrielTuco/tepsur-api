import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { options } from "../swaggerOptions";
import { AppDataSource } from "../db/dataSource";
import { ServerBase } from "../interfaces/server";
import secretaryRoutes from "../Secretary/routes/secretary.routes";
import roleRoutes from "../Auth/routes/role.routes";
import authRoutes from "../Auth/routes/auth.routes";
import teacherRoutes from "../Teacher/routes/teacher.routes";
import adminRutes from "../routes/admin.routes";
import sedeRutes from "../Sede/routes/sede.routes";

import carreraWebRouter from "../Web/carrera.routes";
import moduloWebRouter from "../Web/modulo.routes";

interface Paths {
    auth: string;
    index: string;
    role: string;
    secretary: string;
    teacher: string;
    admin: string;
    sede: string;
    carrera_web: string;
    modulo_web: string;
}

class Server implements ServerBase {
    constructor(
        private app: Application = express(),
        private port: string | number = process.env.PORT || 3000,
        private paths: Paths = {
            index: "/api",
            auth: "/api/auth",
            secretary: "/api/secretary",
            role: "/api/role",
            teacher: "/api/teacher",
            admin: "/api/admin",
            sede: "/api/sede",
            carrera_web: "/api/contenido_web/carrera",
            modulo_web: "/api/contenido_web/modulo",
        }
    ) {
        this.connectDB();
        this.middlewares();
        this.routes();
    }

    async connectDB() {
        try {
            await AppDataSource.initialize();
            console.log("Database conected... OK");
        } catch (error) {
            console.log(error);
        }
    }

    middlewares() {
        //Cors
        this.app.use(cors());

        this.app.use(express.json());

        //Public folder
        this.app.use(express.static("public"));

        this.app.use(morgan("dev"));
    }

    routes() {
        this.app.get(this.paths.index, (_req, res) => {
            res.json({ msg: "Server online..." });
        });
        //Documentation
        const specs = swaggerJSDoc(options);
        this.app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

        this.app.use(this.paths.auth, authRoutes);
        this.app.use(this.paths.secretary, secretaryRoutes);
        this.app.use(this.paths.role, roleRoutes);
        this.app.use(this.paths.teacher, teacherRoutes);
        this.app.use(this.paths.admin, adminRutes);
        this.app.use(this.paths.sede, sedeRutes);

        this.app.use(this.paths.carrera_web, carreraWebRouter);
        this.app.use(this.paths.modulo_web, moduloWebRouter);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server on line in port: ${this.port}`);
        });
    }
}

export default Server;
