import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";

const SECRET: string = process.env.SECRET || 'debug-mode';


const authHandlerMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (!req.user && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decode: any = jwt.verify(token, SECRET)

            const user = await User.findById(decode.id).select("_id")
            if (user)
                req.user = user

        } catch (error) {
            console.log(error)
        }
    }
    next();
})

export default authHandlerMiddleware;