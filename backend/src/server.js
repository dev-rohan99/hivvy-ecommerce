/* ===== - ===== */
import app from "./app.js";
import colors from "colors";
import dotenv from 'dotenv';
import cloudinary from "cloudinary";
import connectDatabase from "./database/database.js";

// handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`.bgRed.white);
    console.log(`Shutting down the server for handling uncaught exception!`.bgRed.white);
});

// config
if(process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config({
        path: "src/config/.env"
    });
}

// database connect
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// create server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`.bgGreen.white);
});

// unhandle promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`.bgRed.white);
    console.log(`Shutting down the server for unhandle promise rejection!`.bgRed.white);
    server.close(() => {
        process.exit(1);
    });
});

