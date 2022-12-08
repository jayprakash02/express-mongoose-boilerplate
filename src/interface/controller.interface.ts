import { Router } from "express";

export default interface Contorller {
    path: string,
    router: Router;
}