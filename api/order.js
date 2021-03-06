const express = require("express");
const orderRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const Order = require("../models/Order");
const User = require("../models/User");
const { OrderConfirmed } = require("../services/emailService");

//Göra en beställning på produkter
orderRouter.post("/neworder", (req, res) => {
  console.log(req.body);
  const newOrder = new Order(req.body);
  newOrder.save((err) => {
    if (err) {
      res.status(500).json({
        message: {
          msgBody: "An error occured while adding order",
          msgError: true,
        },
      });
    } else {
      if (req.body.userId) {
        User.findById({ _id: req.body.userId }, (err, user) => {
          if (err) {
            res.status(500).json({
              message: {
                msgBody: "An error occured retrieving user",
                msgError: true,
              },
            });
          } else {
            user.orderHistory.push(newOrder);
            user.save((err) => {
              if (err) {
                res.status(500).json({
                  message: {
                    msgBody: "An error occured adding order to order history",
                    msgError: true,
                  },
                });
              } else {
                res.status(201).json({
                  message: {
                    msgBody:
                      "Successfully created order and put it in your order history",
                    msgError: false,
                  },
                });
                OrderConfirmed(req.body);
              }
            });
          }
        });
      } else {
        res.status(201).json({
          message: {
            msgBody: "Successfully created order",
            msgError: false,
          },
        });
        OrderConfirmed(req.body);
      }
    }
  });
});

//Lista inkomna beställningar
orderRouter.get(
  "/getorders",
  passport.authenticate("user-rule", { session: false }),
  (req, res) => {
    Order.find({}, (err, orders) => {
      if (err) {
        res.status(500).json({
          message: {
            msgBody: "An error occured while retrieving orders",
            msgError: true,
          },
        });
      } else {
        res.status(200).json({
          orders,
          message: {
            msgBody: "Successfully retrieved orders",
            msgError: false,
          },
        });
      }
    });
  }
);

//Uppdatera beställningar som hanterade
orderRouter.put(
  "/handleorder/:id",
  passport.authenticate("user-rule", { session: false }),
  (req, res) => {
    Order.findByIdAndUpdate(
      { _id: req.params.id },
      { handled: req.body.handled },
      (err) => {
        if (err) {
          res.status(500).json({
            message: {
              msgBody: "An error occured handling order",
              msgError: true,
            },
          });
        } else {
          res.status(200).json({
            message: {
              msgBody: "Successfully handled order",
              msgError: false,
            },
          });
        }
      }
    );
  }
);

//Ta bort beställningar
orderRouter.delete(
  "/deleteorder/:id",
  passport.authenticate("user-rule", { session: false }),
  (req, res) => {
    Order.findByIdAndDelete({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).json({
          message: {
            msgBody: "An error occured deleting order",
            msgError: true,
          },
        });
      } else {
        res.status(200).json({
          message: {
            msgBody: "Successfully deleted order",
            msgError: false,
          },
        });
      }
    });
  }
);

module.exports = orderRouter;
