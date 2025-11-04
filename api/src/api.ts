import express from "express";
import 'dotenv/config'
import cors from "cors";
import authRoutes from "./routes/AuthRouter.js";
import userRouter from "./routes/UserRouter.js";
import {setupSwagger} from "./swagger.js";
import {authenticateUser} from "./middleware/authenticate.js";
import requestRouter from "./routes/RequestRouter.js";
import favouriteRouter from "./routes/FavouriteRouter.js";
import UserController from "./controllers/UserController.js";
import RequestController from "./controllers/RequestController.js";
import FavouriteController from "./controllers/FavouriteController.js";
import UserService from "./services/UserService.js";
import RequestService from "./services/RequestService.js";
import FavouriteService from "./services/FavouriteService.js";

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
app.use("/favourites", authenticateUser, favouriteRouter)

function setupApp(){
    const userService = new UserService();
    const requestService = new RequestService();
    const favouriteService = new FavouriteService();

    userService.setRequestService(requestService);
    requestService.setUserService(userService);
    favouriteService.setRequestServie(requestService);

    UserController.setUserService(userService);
    RequestController.setRequestService(requestService)
    FavouriteController.setFavouriteService(favouriteService)
}

setupApp();




