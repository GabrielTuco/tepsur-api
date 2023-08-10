export class AlreadyExistsError extends Error {
    constructor(
        public message: string,
        public codeStatus: number = 409,
        public name: string = "AlreadyExists"
    ) {
        super(message);
    }
}
