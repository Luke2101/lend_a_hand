import express from "express";
import 'dotenv/config'
import userRoutes from "./routes/userRoutes.js";
import {AuthHandler} from "./lib/AuthHandler.js";
import cors from "cors";
const app = express();
const port = "8080";

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use(express.json())
app.use("/users", userRoutes)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

