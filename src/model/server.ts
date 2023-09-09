import * as dotenv from "dotenv";
dotenv.config();

import http from "http";
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import exceljs from "exceljs";
import { options } from "../swaggerOptions";

import { AppDataSource } from "../db/dataSource";
import { ServerBase } from "../interfaces/server";
import secretaryRoutes from "../Secretary/routes/secretary.routes";
import roleRoutes from "../Auth/routes/role.routes";
import authRoutes from "../Auth/routes/auth.routes";
import teacherRoutes from "../Teacher/routes/teacher.routes";
import adminRoutes from "../Administrator/routes/admin.routes";
import userRoutes from "../Auth/routes/user.routes";
import sedeRoutes from "../Sede/routes/sede.routes";
import studentRoutes from "../Student/routes/student.routes";
import especializacionRoutes from "../Especializacion/routes/especializacion.routes";
import matriculaEspecializacionRoutes from "../Especializacion/routes/matriculaEspecializacion.routes";
import {
    careerRoutes,
    groupRoutes,
    matriculaRoutes,
    moduleRoutes,
    scheduleRoutes,
    metodoPagoRoutes,
    tarifaPensionCarreraRoutes,
} from "../Matricula/routes";
import pensionRoutes from "../Pension/routes/pension.routes";
import ubigeoRoutes from "../routes/ubigeo.routes";
import certificadoRoutes from "../Certificados/routes/certificado.routes";
import { swaggerCustomCss } from "../swagger-custom-styles";
import { DataSource } from "typeorm";
import { Paths } from "../interfaces/routePaths";

class Server implements ServerBase {
    cloudinary: any;
    dataSource: DataSource;
    server: http.Server;
    constructor(
        private app: Application = express(),
        private port: string | number = process.env.PORT ?? 8080,
        private paths: Paths = {
            index: "/api",
            auth: "/api/auth",
            secretary: "/api/secretary",
            role: "/api/role",
            teacher: "/api/teacher",
            student: "/api/student",
            admin: "/api/admin",
            user: "/api/user",
            sede: "/api/sede",
            module: "/api/module",
            career: "/api/career",
            schedule: "/api/schedule",
            group: "/api/group",
            matricula: "/api/matricula",
            especializacion: "/api/especializacion",
            matriculaEspe: "/api/matricula-especializacion",
            metodoPago: "/api/metodo-pago",
            tarifaPension: "/api/tarifa-pension",
            pension: "/api/pensiones",
            utilidades: "/api/utilidades",
            certificados: "/api/certificados",
        }
    ) {
        //Cloudinary config
        this.cloudinary = cloudinary.config({
            cloud_name: `${process.env.CLOUDINARY_NAME}`,
            api_key: `${process.env.CLOUDINARY_API_KEY}`,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        //this.connectDB();
        this.middlewares();

        //Routes
        this.routes();

        this.connectDB();
    }
    get getApp() {
        return this.app;
    }

    async connectDB() {
        try {
            console.log("Iniciando conexion con la base de datos...");
            this.dataSource = await AppDataSource.initialize();
            console.log("Database conected... OK");
        } catch (error) {
            console.log(error);
        }
    }

    public async closeConnectionDB() {
        try {
            if (this.dataSource) await this.dataSource.destroy();
        } catch (error) {
            console.log(error);
        }
    }

    middlewares() {
        //Cors
        this.app.use(cors());

        this.app.use(express.json());

        //Public folder
        this.app.set("view engine", "ejs");
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
        // this.app.get("/", (_req, res) => {
        //     res.send("index.html");
        // });

        this.app.get(this.paths.index, (_req, res) => {
            res.json({ msg: "Server online..." });
        });
        //Documentation
        const specs = swaggerJSDoc(options);
        this.app.use(
            "/api/docs",
            swaggerUi.serve,
            swaggerUi.setup(specs, swaggerCustomCss)
        );

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
        this.app.use(this.paths.especializacion, especializacionRoutes);
        this.app.use(this.paths.matriculaEspe, matriculaEspecializacionRoutes);
        this.app.use(this.paths.metodoPago, metodoPagoRoutes);
        this.app.use(this.paths.student, studentRoutes);
        this.app.use(this.paths.tarifaPension, tarifaPensionCarreraRoutes);
        this.app.use(this.paths.pension, pensionRoutes);
        this.app.use(this.paths.utilidades, ubigeoRoutes);
        this.app.use(this.paths.certificados, certificadoRoutes);
    }

    listen() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Server online in port: ${this.port}`);
        });
    }
    stop() {
        console.log(this.server);
        if (this.server) this.server.close();
    }
}

export default Server;
