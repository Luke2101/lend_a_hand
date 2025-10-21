import express from "express";
import 'dotenv/config'
import cors from "cors";
import authRoutes from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import {setupSwagger} from "./swagger.js";
import {authenticateUser} from "./middleware/authenticate.js";
import requestRouter from "./routes/requestRouter.js";
export const app = express();
export const port = "8080";



setupSwagger(app);
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use(express.json())

app.use("/auth", authRoutes)
app.use("/user", authenticateUser,userRouter)
app.use("/request", authenticateUser, requestRouter)





