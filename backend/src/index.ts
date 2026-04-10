import * as dotenv from "dotenv";
dotenv.config();
import express, {Request, Response, Application} from "express";
import cors from "cors"
import helmet from "helmet";
import passport from "passport";
import {connect} from "mongoose";
import fileUpload from "express-fileupload";
import authenticate from "./config";
import mongoose from "mongoose";
import { authRouter, recipeRouter } from "./routes";


const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.use(helmet());

app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024},
        abortOnLimit: true,
    })
);

app.use(passport.initialize());

authenticate(passport);

app.use('/auth', authRouter)
app.use('/recipe', recipeRouter)

app.get("/ping", (req: Request, res: Response) => {
    res.send('pong');
});

app.all('*', (req: Request, res: Response) => {
    res.status(404).json({message: "The route you requested is not found "})
});

const runDB = async () =>{
  connect(process.env.MONGODB_URI as string)
    .then(() => console.log("DB connected successfully "))
    .catch((err) => {
      console.log("DB not connected");
      console.log("Error:", err.message);
    })
};

runDB();

const PORT = (process.env.PORT as unknown as number) || 5000;

app.listen(PORT, () =>{
    console.log(`Server listening on port ${PORT}`);
}
        );

