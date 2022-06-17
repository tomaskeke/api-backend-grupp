const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// import userRouter
const userRouter = require("./api/user");

// Development env vars
require("dotenv").config();

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true },
  () => console.log("Connected to database successfully")
);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
