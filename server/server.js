import {config} from "dotenv";
import express from 'express'
import bodyParser from "body-parser";
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import router from './router/index.js';
import errorMiddleware from "./middlewares/error-middleware.js";
import authMiddleware from "./middlewares/auth-middleware.js";

config({path: 'server/.env'});
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
    credentials: true,
    origin: "http://209.38.218.8:3000" // process.env.CLIENT_URL //!!!!!!!!!!!!!!
}));
// app.options('*', cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', router)

app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();