import mongoose from "mongoose";

export function dbConnection() {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "innovators",
    })
    .then(() => {
      console.log("DB Connected Succesfully");
    })
    .catch((error) => {
      console.log("DB Failed to connect", error);
    });
}