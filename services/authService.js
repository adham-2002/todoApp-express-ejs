import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";

// @desc SignUp
// @route POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  // 1- create User
  const user = await User.create({
    username,
    email,
    password,
    confirmPassword,
  });
  // 2- Generate Token
  const token = createToken({ id: user._id });

  res.status(201).json({
    data: user,
    token,
  });
});
