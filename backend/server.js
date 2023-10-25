/* ===== - ===== */
import app from "./app.js";
import colors from "colors";
import dotenv from 'dotenv';
import cloudinary from "cloudinary";
import connectDatabase from "./database/database.js";
import path from "path";
const __dirname = path.resolve();

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

if (process.env.NODE_ENV === 'production') {
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

