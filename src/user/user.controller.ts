import { Request, Response, Router } from "express";
import Contorller from "../interface/controller.interface";
import { IUser, User } from "./user.model";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
export default class UserController implements Contorller {
    public path = "/users";
    public router = Router();
    private user = User;
    public token_expiry = '5h';
    public SECRET:string = process.env.SECRET || 'debug-mode';

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.route(this.path).get(this.searchUser).post(this.saveUser)

        this.router.route(this.path + '/:id').get(this.getUser).patch(this.patchUser)

        this.router.route(this.path + '/:uid').get(this.getUser).patch(this.patchUser)

        this.router.route(this.path + '/:uid/token').post(this.sendToken).delete(this.revokeToken)

        this.router.route(this.path + '/autocomplete').get(this.searchUser)
    }

    private getUser = asyncHandler(async (req: Request, res: Response) => {
        let user;
        if (req.params?.id) {
            user = await User.findOne({ id: req.params.id })
        } else if (req.params?.uid) {
            user = await User.findOne({ uid: req.params.uid })
        }
        res.status(200).json(user)
    })

    private searchUser = asyncHandler(async (req: Request, res: Response) => {
        let query: any = {};
        for (const key in req.query) {
            if (key in ['id', 'uid', 'username', 'email', 'given_name', 'middle_name', 'name', 'family_name', 'nickname', 'phone_number', 'comment', 'picture', 'directory', 'tags', 'is_suspended']) {
                query[key] = req.query[key]
            }
        }
        let user: IUser[] = await this.user.find(query);

        res.json(user)
    })

    private patchUser = asyncHandler(async (req: Request, res: Response) => {
        let user;
        if (req.params?.id) {
            user = await User.findOneAndUpdate({ id: req.params.id }, req.body)
        } else if (req.params?.uid) {
            user = await User.findOneAndUpdate({ uid: req.params.uid }, req.body)
        }
        res.status(200).json(user);
    })

    private saveUser = asyncHandler(async (req: Request, res: Response) => {
        try {
            const user: IUser = req.body
            const resp = await User.create(user)
            res.status(201).json(resp)
        } catch (error) {
            res.status(400).send(error)
        }
    })

    private sendToken = asyncHandler(async (req: Request, res: Response) => {
        try {
            const id = req.params.uid
            const user = await User.findById(id)

            if (!user) {
                throw new Error("User Doesnot Exists")
            }
            res.status(200).json(this.generateToken(user.id, this.token_expiry))
        } catch (error) {
            res.status(400).send(error)
        }
    })

    private revokeToken = asyncHandler(async (req: Request, res: Response) => {
        res.json(req.user)
    })

    private generateToken = (id: string, exp: string) => {
        return {
            token: jwt.sign({ id }, this.SECRET, {
                expiresIn: exp,
            }),
            expiresIn: exp,
        }
    }

    private getIdFromToken = (token:string) => {
        
    }
}