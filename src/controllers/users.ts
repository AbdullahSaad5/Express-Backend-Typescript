import express from "express";
import { User } from "../models/User.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, async (req, res, next) => {
  const users = await User.find().select(
    "-resetPasswordToken -resetPasswordExpires -password"
  );

  res.json({
    message: "Users retrieved successfully",
    users,
  });
});

router.post("/", verifyToken, async (req, res, next) => {
  const { userType, firstName, lastName, email, password, profilePicture } =
    req.body;

  const alreadyExists = await User.findOne({ email });

  if (alreadyExists)
    return res.status(409).json({
      message: "User already exists",
    });

  try {
    await User.create({
      userType,
      firstName,
      lastName,
      email,
      password,
      profilePicture,
    });
    res.json({
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:id", verifyToken, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "User ID is required" });

  let user;
  try {
    user = await User.findById(id).select(
      "-resetPasswordToken -resetPasswordExpires -password"
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  if (!user)
    return res.status(404).json({
      message: "User not found",
    });

  res.json({
    message: "User retrieved successfully",
    user,
  });
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "User ID is required" });

  let user;
  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  if (!user)
    return res.status(404).json({
      message: "User not found",
    });

  res.json({
    message: "User deleted successfully",
  });
});

router.patch("/:id", verifyToken, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "User ID is required" });

  let user;
  try {
    user = await User.findOneAndUpdate({ _id: id }, req.body, { new: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  if (!user)
    return res.status(404).json({
      message: "User not found",
    });

  res.json({
    message: "User updated successfully",
    user,
  });
});

export default router;
