const express = require("express");
const productRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const Product = require("../models/Product");

productRouter.post(
  "/newproduct",
  passport.authenticate("user-rule", { session: false }),
  (req, res) => {
    const { name, description, price } = req.body;
    console.log(req.body);
  }
);

module.exports = productRouter;