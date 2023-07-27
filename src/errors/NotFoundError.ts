import { DatabaseErrorBase } from "./DatabaseErrorBase";

export class NotFoundError extends DatabaseErrorBase {
    constructor(
        public message: string,
        public codeStatus: number = 404,
        public name: string = "Not found error"
    ) {
        super(message, codeStatus, name);
    }
}
