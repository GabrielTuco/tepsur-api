import yargs from "yargs";

//Yargs config
const argv = yargs(process.argv.slice(2))
    .options({
        develop: { type: "boolean" },
    })
    .parseSync();

let dataSourceOptions: object;

if (!!argv.develop) {
    dataSourceOptions = {
        port: parseInt(`${process.env.DEV_DB_PORT}`) || 5432,
        username: `${process.env.DEV_DB_USER}`,
        host: `${process.env.DEV_DB_HOST}`,
        database: `${process.env.DEV_DB_NAME}`,
        password: `${process.env.DEV_DB_PASSWORD}`,
    };
} else {
    dataSourceOptions = {
        port: parseInt(`${process.env.DB_PORT}`) || 5432,
        username: `${process.env.DB_USER}`,
        host: `${process.env.DB_HOST}`,
        database: `${process.env.DB_NAME}`,
        password: `${process.env.DB_PASSWORD}`,
    };
}

export default dataSourceOptions;
