import express from "express";
import 'dotenv/config'
import userRoutes from "./routes/userRoutes.js";
import {AuthHandler} from "./lib/AuthHandler.js";
const app = express();
const port = "8080";

app.use(express.json())
app.use("/users", userRoutes)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

