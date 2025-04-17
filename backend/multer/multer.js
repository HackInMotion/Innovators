import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const createMulterUploader = (folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + " - " + file.originalname);
    },
  });

  const upload = multer({ storage });

  return upload;
};

//For Single upload
export const uploadSingleFile = (fieldName, folderName) => {
  return createMulterUploader(folderName).single(fieldName);
};

//For Multiple fields upload
export const uploadMultipleFiles = (arrayOfFields, folderName) => {
  return createMulterUploader(folderName).fields(arrayOfFields);
};
