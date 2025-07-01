import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // Restrict uploads to the 'uploads/' directory
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({ storage })

export default upload