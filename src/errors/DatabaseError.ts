export class DatabaseError extends Error {
    constructor(
        public message: string,
        public codeStatus: number,
        public name: string
    ) {
        super(message);
    }
}
