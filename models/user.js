const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
});

// Middleware that runs before every mongodb save call via mongoose.
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) next();
  bcrypt.hash(this.password, 10, (err, passwordHashed) => {
    if (err) return next(err);
    this.password = passwordHashed;
    next();
  });
});

// called from passport local strategy to compare password submitted from client with pw on user in DB.
UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    } else {
      if (!isMatch) return callback(null, isMatch);
      return callback(null, this);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
