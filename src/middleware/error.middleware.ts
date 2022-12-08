import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http";

export default function errorHandlerMiddleware(error: HttpException, req: Request, res: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Something Went Wrong';
    const stack = process.env.DEBUG ? error.stack : null;
    res.status(status).json({ message: message, stack: stack })
}