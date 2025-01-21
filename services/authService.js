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
  // 1- check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new apiError("User already exists", 400));
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
  //1) check if email exists and password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new apiError("Invalid email or password", 401));
  }
  if (!user.active) {
    return next(new apiError("User is not active", 401));
  }

  const token = createToken({ id: user._id });
  res.status(200).json({
    data: user,
    token,
  });
});
