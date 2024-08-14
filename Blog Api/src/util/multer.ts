import path from "path";

import multer from "multer";

const diskStorage = multer.diskStorage({
    destination: (request: any, file: any, callback: any) => {
        /**==> falilo je src/ iz nekog razloga */
        /**==> read the docs: if function is provided
         * here, directory must be manually built
         */
        callback(null, 'images/');
    },
    filename: (request: any, file: any, callback: any) => {
        callback(
            null, 
            new Date()
                .toISOString()
                .replace(/:/g, '-') + 
            path.extname(file.originalname)
        );
    }
});

const filter = (request: any, file: any, callback: Function) => {
    if(
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
    )
    {
        callback(null, true);
    }
    else
    {
        callback(null, false);
    }
}

export const multerUploadMiddleware = multer({
    storage: diskStorage,
    fileFilter: filter
});