const jwt = require("jsonwebtoken");

module.exports = {
  async verifyToken(req, res, next) {
    try {
      if (!req.headers.authorization) {
        return res.status(401).send("Unauthorized");
      }
      jwt.verify(req.headers.authorization, process.env.JWT_SECRET, {
        issuer: process.env.JWT_ISSUER,
      });
    } catch (error) {
      res.status(401).send("Token is invalid");
    }
    res.locals.userDetails = jwt.decode(req.headers.authorization, {
      json: true,
    });
    next();
  },
};
