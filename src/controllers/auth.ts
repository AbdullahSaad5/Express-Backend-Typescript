import express from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { verifyToken, RequestWithUser } from "../middlewares/verifyToken.js";
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Hello World");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(404).send("User does not exist");
      user.comparePassword(password).then((isMatch) => {
        if (!isMatch) return res.status(400).send("Invalid credentials");
        user = user.toObject();
        delete user.password;
        const token = jwt.sign(user, process.env.JWT_SECRET);
        res.send({ message: "Login successful", token });
      });
    })
    .catch(next);
});

router.post("/register", (req, res, next) => {
  const { userType, firstName, lastName, email, password } = req.body;

  User.create({ userType, firstName, lastName, email, password })
    .then((user) => {
      res.send("Registration successful");
    })
    .catch(next);
});

router.post("/forgot-password", (req, res, next) => {
  console.log(req.body);
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(404).send("User does not exist");
      user.resetPasswordToken = Math.round(Math.random() * 1000000);
      user.resetPasswordExpires = new Date(Date.now() + 3600000);
      user.save();
      res.send({
        message: "Password reset email sent",
        resetPasswordToken: user.resetPasswordToken,
      });
    })
    .catch(next);
});

router.post("/reset-password", (req, res, next) => {
  const { email, resetPasswordToken, newPassword } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(404).send("User does not exist");
      if (user.resetPasswordToken !== resetPasswordToken)
        return res.status(400).send("Invalid token");
      if (user.resetPasswordExpires < new Date(Date.now()))
        return res.status(400).send("Token expired");
      user.password = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.save();
      res.send("Password reset successful");
    })
    .catch(next);
});

router.post("/change-password", verifyToken, (req, res, next) => {
  const user = (req as RequestWithUser).user;

  const { oldPassword, newPassword } = req.body;

  User.findOne({ email: user.email })
    .then((user) => {
      if (!user) return res.status(404).send("User does not exist");
      user.comparePassword(oldPassword).then((isMatch) => {
        if (!isMatch) return res.status(400).send("Invalid credentials");
        user.password = newPassword;
        user.save();
        res.send("Password changed successfully");
      });
    })
    .catch(next);
});

router.post("/update-profile", verifyToken, (req, res, next) => {
  const user = (req as RequestWithUser).user;

  const { firstName, lastName, profilePicture } = req.body;

  User.findOne({ email: user.email })
    .then((user) => {
      if (!user) return res.status(404).send("User does not exist");
      user.firstName = firstName;
      user.lastName = lastName;
      user.profilePicture = profilePicture;
      user.save();
      res.send("Profile updated successfully");
    })
    .catch(next);
});

router.get("/get-profile", verifyToken, (req, res, next) => {
  const user = (req as RequestWithUser).user;

  User.findOne({ email: user.email })
    .then((user) => {
      if (!user) return res.status(404).send("User does not exist");
      user = user.toObject();
      delete user.password;
      res.send(user);
    })
    .catch(next);
});

export default router;
