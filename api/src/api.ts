import express from "express";
import 'dotenv/config'
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = "8080";

app.use(express.json())
app.use("/auth", authRoutes)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

