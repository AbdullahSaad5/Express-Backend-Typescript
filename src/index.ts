import express from "express";
import mongoose from "mongoose";
import AuthRouter from "./controllers/auth.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = 3000;

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use("/auth", AuthRouter);

app.all("*", (req, res, next) => {
  res.status(404).send("This route does not exist");
});

app.listen(PORT, () => {
  console.log("Listening to port 3000");
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong",
      error: err.message,
    });
  }
);
