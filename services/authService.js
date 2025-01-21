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
  const { username, email, password, confirmPassword, slug } = req.body;
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
    slug,
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
export const protect = asyncHandler(async (req, res, next) => {
  // 1) check if token is exists if exists hold it in a variable
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new apiError("Not authorized to access this route", 401));
  }
  // 2) verify token ( no changes happen or expired)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new apiError("User no longer exists", 401));
  }
  //4) check if user is active
  if (!currentUser.active) {
    return next(new apiError("User is not active", 401));
  }
  req.user = currentUser;
  next();
});
