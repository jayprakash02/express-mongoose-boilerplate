import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import Contorller from "./interface/controller.interface";
import authHandlerMiddleware from "./middleware/auth.middleware";
import errorHandlerMiddleware from "./middleware/error.middleware";


class App {
    public app: express.Application;

    constructor(controllers: Contorller[]) {
        this.app = express();

        this.connectToDatabase();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
    }
    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    private initializeMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(express.urlencoded({extended:false}))
        this.app.use(errorHandlerMiddleware);
        this.app.use(authHandlerMiddleware)
    }

    private initializeControllers(controllers: Contorller[]) {
        controllers.forEach(controller => {
            this.app.use('/api', controller.router)
        });
    }



    private async connectToDatabase() {
        try {
            const DB: string = process.env.DB || '';
            if (DB === '') {
                throw new Error('DB is not set in environment');
            }
            const conn = await mongoose.connect(DB);
            console.log(`DATABASE CONNECTED TO: ${conn.connection.host}`)

        } catch (error) {
            console.log(error)
            process.exit(1)
        }
    }
}

export default App;