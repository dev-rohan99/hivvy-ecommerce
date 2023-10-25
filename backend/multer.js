import multer from "multer";


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "upload/")
    },

    filename: (req, res, cb) => {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 9999);
        const filename = file.originalname.split(".")[0];
        cb(null, filename + "_" + uniqueSuffix + ".png");
    }
});

const upload = multer({storage: storage});

export default upload;
