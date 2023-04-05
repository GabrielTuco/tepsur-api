import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    port: parseInt(`${process.env.DB_PORT}`) || 5432,
    username: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASSWORD}`,
    synchronize: true,
    logging: false,
    entities: ["entity/*.ts"],
    migrations: [],
    subscribers: [],
});
