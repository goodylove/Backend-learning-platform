import "express-async-errors"

import dotenv from "dotenv";

import express from "express";
import cors from "cors";


import authRouter from "../src/routes/authRoute.js"

import { ErrorHandler } from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

dotenv.config();
const PORT = process.env.PORT || 5000;


 export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.use("/api/v1/auth", authRouter);


app.use(notFound)
app.use(ErrorHandler)


const start = () => {
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

start();
