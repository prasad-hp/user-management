import mongoose from "mongoose";
import { config } from "dotenv"
config()
const dbUrl = process.env.MONGODB_URL;

export async function connectDataBase(){
    try {
        if (!dbUrl) {
            throw new Error("MONGODB_URL is not defined in the environment variables.");
        }
        await mongoose.connect(dbUrl)
        console.log("Database connected Successfully")
    } catch (error) {
        console.error("Database connection failed", error)
        throw new Error("could not connect to database")
    }
}