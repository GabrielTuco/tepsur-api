import { DatabaseErrorBase } from "./DatabaseErrorBase";

export class AlreadyExistsError extends DatabaseErrorBase {
    constructor(
        public message: string,
        public codeStatus: number = 409,
        public name: string = "AlreadyExists"
    ) {
        super(message, codeStatus, name);
    }
}
