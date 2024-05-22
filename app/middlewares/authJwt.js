// middleware/authJwt.js

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
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

const checkRole = (role) => {
  return (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      Role.find(
        {
          _id: { $in: user.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === role) {
              next();
              return;
            }
          }

          res.status(403).send({ message: `Require ${role} Role!` });
        }
      );
    });
  };
};

const authJwt = {
  verifyToken,
  isAdmin: checkRole("admin"),
  isModerator: checkRole("moderator"),
  canAccessPipe: checkRole("pipe_access"),
  canAccessWell: checkRole("well_access")
};

module.exports = authJwt;
