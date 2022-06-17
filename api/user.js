const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

//development env vars
require("dotenv").config();

// function to create our JWT (cookie)
const signToken = (userId) => {
  return jwt.sign(
    {
      iss: "Tomas",
      sub: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 60 * 24,
    }
  );
};

userRouter.post("/register", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) {
      res
        .status(500)
        .json({ msg: { msgBody: "An error occurred", msgError: true } });
    }
    if (user) {
      res
        .status(400)
        .json({ msg: { msgBody: "Username already taken", msgError: true } });
    } else {
      const newUser = new User({ username, password });
      newUser.save((err) => {
        if (err) {
          res
            .status(500)
            .json({ msg: { msgBody: "An error occurred", msgError: true } });
        } else {
          res.status(201).json({
            msg: { msgBody: "User successfully created", msgError: false },
          });
        }
      });
    }
  });
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username } = req.user;
      const token = signToken(_id);
      res.cookie("access-token", token, { httpOnly: true, sameSite: true });
      res.status(200).json({
        isAuthenticated: true,
        user: { _id, username },
        msg: { msgBody: "Successfully logged in", msgError: false },
      });
    }
  }
);

userRouter.get(
  "/auth",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id, username } = req.user;
    res.status(200).json({
      isAuthenticated: true,
      user: { _id, username },
    });
  }
);

userRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access-token");
    res
      .status(200)
      .json({ msg: { msgBody: "Successfully logged out", msgError: false } });
  }
);

userRouter.put(
  "/update/:id",
  passport.authenticate("user-rule", { session: false }), (req, res) => {
    const {
      firstname,
      lastname,
      email,
      phone,
      street,
      zipCode,
      town,
      country,
    } = req.body;

    User.findByIdAndUpdate(
      { _id: req.params.id },
      { firstname, lastname, email, phone, street, zipCode, town, country },
      (err) => {
        if (err) {
          res
            .status(500)
            .json({ msg: { msgBody: "An error occurred updating your kebabrull account", msgError: true } });
        }else{
          res.status(200).json({ msg: { msgBody: "you successfully updated your account"}})
        }
      }
    );
  }
);

module.exports = userRouter;
