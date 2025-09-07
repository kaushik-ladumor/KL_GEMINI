import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Database_Key = process.env.MONGO_URI;

const DbConnection = async () => {
  mongoose
    .connect(Database_Key)
    .then((res) => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Connection failed", error);
    });
};

export default DbConnection;
