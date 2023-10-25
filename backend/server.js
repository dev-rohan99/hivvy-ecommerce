/* ===== - ===== */
import colors from "colors";
import cloudinary from "cloudinary";
import connectDatabase from "./database/database.js";
import path from "path";
const __dirname = path.resolve();
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
    origin: ["http://localhost:3000"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cookieParser());
app.use("/", express.static("upload"));
app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}));

// api routing
app.use("/api/v1/users", userRouter);

// error handling
app.use(errorHandler);

// handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`.bgRed.white);
    console.log(`Shutting down the server for handling uncaught exception!`.bgRed.white);
});

// config
if(process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config({
        path: ".env"
    });
}

if (process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
    );
}

// database connect
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// unhandle promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`.bgRed.white);
    console.log(`Shutting down the server for unhandle promise rejection!`.bgRed.white);
    server.close(() => {
        process.exit(1);
    });
});

// create server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`.bgGreen.white);
});
