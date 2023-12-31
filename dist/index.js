import express from "express";
import mongoose from "mongoose";
import AuthRouter from "./controllers/auth.js";
import UserRouter from "./controllers/users.js";
import VehicleRouter from "./controllers/vehicles.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
dotenv.config();
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
    console.log("Connected to database");
})
    .catch((err) => {
    console.log("Error connecting to database", err);
});
app.get("/", (req, res, next) => {
    res.json({ message: "Hello World" });
});
app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/vehicles", VehicleRouter);
app.all("*", (req, res, next) => {
    res.status(404).send("This route does not exist");
});
app.listen(PORT, () => {
    console.log("Listening to port 3000");
});
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({
        message: "Something went wrong",
        error: err.message,
    });
});
//# sourceMappingURL=index.js.map