import { DatabaseErrorBase } from "./DatabaseErrorBase";

export class DatabaseError extends DatabaseErrorBase {
    constructor(
        public message: string,
        public codeStatus: number,
        public name: string
    ) {
        super(message, codeStatus, name);
    }
}
