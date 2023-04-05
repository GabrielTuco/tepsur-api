export interface ServerBase {
    connectDB: Function;
    middlewares: Function;
    routes: Function;
    listen: Function;
    //otro?:Function;
}
