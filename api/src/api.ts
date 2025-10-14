import express from "express";
import 'dotenv/config'
import cors from "cors";
import authRoutes from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
const app = express();
const port = "8080";

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use(express.json())
app.use("/auth", authRoutes)
app.use("/user", userRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

