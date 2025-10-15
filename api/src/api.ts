import express from "express";
import 'dotenv/config'
import cors from "cors";
import authRoutes from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import {authenticateUser} from "./middleware/auth.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {setupSwagger} from "./swagger.js";
const app = express();
const port = "8080";



setupSwagger(app);
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use(express.json())

app.use("/auth", authRoutes)
app.use("/user", authenticateUser,userRouter)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

