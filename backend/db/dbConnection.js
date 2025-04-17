import mongoose from "mongoose";

export function dbConnection() {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "BrewMaster",
    })
    .then(() => {
      console.log("DB Connected Succesfully");
    })
    .catch((error) => {
      console.log("DB Failed to connect", error);
    });
}