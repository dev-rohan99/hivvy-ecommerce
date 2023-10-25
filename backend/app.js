/* ===== - ===== */
import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import errorHandler from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
/* ===== - ===== */
const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cookieParser());
app.use("/", express.static("upload"));
// app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}));

/* ===== - ===== */
if(process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config({
        path: ".env"
    })
}

// api routing
app.use("/api/v1/users", userRouter);

// error handling
app.use(errorHandler);

/* ===== - ===== */
export default app;
