import "reflect-metadata";
import Server from "./model/server";

const server = new Server();
// server.connectDB();
server.listen();

export default server;
