import dotenv from "dotenv";

import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

const start = () => {
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

start();
