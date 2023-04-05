import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { AppDataSource } from "../db/dataSource";
import { ServerBase } from "../interfaces/server";

interface Paths {
    index: string;
}

class Server implements ServerBase {
    constructor(
        private app: Application = express(),
        private port: string | number = process.env.PORT || 3000,
        private paths: Paths = {
            index: "/api",
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

        // this.app.use(this.paths.auth, authRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server on line in port: ${this.port}`);
        });
    }
}

export default Server;
