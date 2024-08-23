import { Router } from "express";
import user from "./user.js";

const mainMouter = Router();

mainMouter.use("/user", user)

export default mainMouter;