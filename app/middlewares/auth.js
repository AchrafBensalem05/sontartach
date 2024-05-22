const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const authenticateToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
const isPipeAdmin = (req, res, next) => {
    User.findById(req.userId).populate("roles", "-__v").exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i].name === "pipeAdmin") {
          next();
          return;
        }
      }
  
      res.status(403).send({ message: "Require Pipe Admin Role!" });
      return;
    });
  };
  
const auth={authenticateToken, isPipeAdmin}
module.exports = auth;
