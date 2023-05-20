import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import { options } from "../swaggerOptions";

import { AppDataSource } from "../db/dataSource";
import { ServerBase } from "../interfaces/server";
import secretaryRoutes from "../Secretary/routes/secretary.routes";
import roleRoutes from "../Auth/routes/role.routes";
import authRoutes from "../Auth/routes/auth.routes";
import teacherRoutes from "../Teacher/routes/teacher.routes";
import adminRoutes from "../routes/admin.routes";
import userRoutes from "../Auth/routes/user.routes";
import sedeRoutes from "../Sede/routes/sede.routes";
import {
    careerRoutes,
    groupRoutes,
    matriculaRoutes,
    moduleRoutes,
    scheduleRoutes,
    metodoPagoRoutes,
} from "../Matricula/routes";

interface Paths {
    auth: string;
    index: string;
    role: string;
    secretary: string;
    teacher: string;
    admin: string;
    user: string;
    sede: string;
    module: string;
    career: string;
    schedule: string;
    group: string;
    matricula: string;
    metodoPago: string;
}

class Server implements ServerBase {
    cloudinary: any;
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
            user: "/api/user",
            sede: "/api/sede",
            module: "/api/module",
            career: "/api/career",
            schedule: "/api/schedule",
            group: "/api/group",
            matricula: "/api/matricula",
            metodoPago: "/api/metodo-pago",
        }
    ) {
        //Cloudinary config
        this.cloudinary = cloudinary.config({
            cloud_name: `${process.env.CLOUDINARY_NAME}`,
            api_key: `${process.env.CLOUDINARY_API_KEY}`,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

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

        this.app.use(
            fileUpload({
                useTempFiles: true,
                tempFileDir: "/tmp/",
            })
        );
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
        this.app.use(this.paths.admin, adminRoutes);
        this.app.use(this.paths.user, userRoutes);
        this.app.use(this.paths.sede, sedeRoutes);
        this.app.use(this.paths.module, moduleRoutes);
        this.app.use(this.paths.career, careerRoutes);
        this.app.use(this.paths.schedule, scheduleRoutes);
        this.app.use(this.paths.group, groupRoutes);
        this.app.use(this.paths.matricula, matriculaRoutes);
        this.app.use(this.paths.metodoPago, metodoPagoRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server on line in port: ${this.port}`);
        });
    }
}

export default Server;
