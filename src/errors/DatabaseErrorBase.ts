export abstract class DatabaseErrorBase extends Error {
    constructor(
        public message: string,
        public codeStatus: number,
        public name: string
    ) {
        super(message);
    }
}
