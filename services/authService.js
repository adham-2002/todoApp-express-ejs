import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import apiError from "../utils/apiError.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";

//! @desc SignUp
// @route POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  // 1- create User
  const exists = await User.findOne({ email });
  if (exists) {
    return next(new apiError("email already in use", 401));
  }
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
//! @desc SignIn
// @Route POST /api/v1/auth/signin
// @access Public
export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  const token = createToken({ id: user._id });
  res.status(200).json({
    data: user,
    token,
  });
});
