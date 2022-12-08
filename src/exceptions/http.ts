export default class HttpException extends Error {
    public status: number;
    public message: string;
    public stack?: string | undefined;
    constructor(status: number, message: string, stack: string | undefined) {
        super(message);
        this.status = status;
        this.message = message;
        this.stack = stack
    }
}