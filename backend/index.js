import express from "express";
import { config } from "dotenv";
import mainMouter from "./routes/index.js";
import cors from "cors"
import { connectDataBase } from "./db/index.js";
config() 
const PORT = 5050;
const app = express();
app.use(cors())
app.use(express.json());

app.use("/api/v1/", mainMouter);

connectDataBase()
    .then(()=>{
        app.listen(PORT, ()=>console.log(`Port is running successfully at port ${PORT}`))
    })
.catch((err)=> console.log(err))